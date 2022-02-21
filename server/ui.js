const { resolve } = require("path");
const { createServer: createViteDevServer } = require("vite");
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { getPort } = require("get-port-please");

const server = createServer();

function createServer() {
  const server = express();
  
  switch (process.env.NODE_ENV) {
    case "production": {
      prodStaticFiles(server);
      break;
    }
    default: {
      proxyViteDevServer(server);
      break;
    }
  }
  
  return server;
}

async function createDevServer() {
  const PORT = process.env.PORT || 8080;
  const [ devServer, port ] = await Promise.all([
    createViteDevServer(),
    getPort({ port: PORT + 1 }),
  ]);
  
  const address = `http://localhost:${port}`;
  await devServer.listen(port);
  console.log();
  console.log(`Vite dev server running at:`);
  console.log(address);
  console.log();
  return address;
}

async function proxyViteDevServer(server) {
  const devServerPromise = createDevServer();
  
  server.use(waitUntilResolved(devServerPromise));
  
  const VITE_DEV_SERVER_ADDR = await devServerPromise;
  server.use(createProxyMiddleware({
    target: VITE_DEV_SERVER_ADDR,
    ws: true,
  }));
}

function waitUntilResolved(promise) {
  return async function (req, res, next) {
    await promise;
    next();
  };
}

function prodStaticFiles(server) {
  const distDir = resolve(__dirname, "../dist");
  server.use(express.static(distDir));
}

module.exports = server;
