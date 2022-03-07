const config = require("config");
const express = require("express");
const {
  waitUntilResolved,
  getPort,
  listen,
  registry: { connect },
} = require("~/util");
const PRODUCTION = process.env.NODE_ENV === "production";

const { REGISTRY_PORT = 9090 } = process.env;
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
  const distDir = resolve(__dirname, "./dist");
  server.use(express.static(distDir));
  return server;
}

module.exports = server;

(async function main() {
  const registry = connect(REGISTRY_PORT);
  const port = await getPort(config.get("ui.port"));
  const { url } = await listen(server, port);
  console.log(`Application UI server running: ${url}`);
  registry.register("ui", { port });
})();
