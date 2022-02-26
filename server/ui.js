const express = require("express");
const PRODUCTION = process.env.NODE_ENV === "production";

const server = express();

server.use(PRODUCTION ? prodServer() : devServer());
 
function devServer() {
  const { createServer: createViteDevServer } = require("vite");
  const server = express();
  const vitePromise = createViteDevServer({
    server: { middlewareMode: "html" },
  });
  
  server.use(waitUntilResolved(vitePromise));
  vitePromise.then(vite => server.use(vite.middlewares));
  
  return server;
}

function prodServer() {
  const { resolve } = require("path");
  const server = express();
  const distDir = resolve(__dirname, "../dist");
  server.use(express.static(distDir));
  return server;
}

function waitUntilResolved(promise) {
  return async function (req, res, next) {
    await promise;
    next();
  };
}

module.exports = server;
