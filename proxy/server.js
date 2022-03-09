const config = require("config");
const express = require("express");
const proxy = require("express-http-proxy");
const chalk = require("chalk");
const {
  getPort,
  waitUntilResolved,
  listen,
  registry: { connect },
} = require("~/util");

const { REGISTRY_PORT = 9090 } = process.env;

const registry = connect(REGISTRY_PORT);
const server = express();

const uiService = registry.get("ui");

server.use(loggingMiddleware());
server.use(uiProxyMiddleware());
server.use("/api", apiMiddleware());

(async function main() {
  const port = await getPort(config.get("proxy.port"));
  const { url } = await listen(server, port);
  console.log(
    chalk`${ chalk.bold.inverse.green(" Application ") } server running:`,
    chalk.green.bold(url),
  );
})();

function loggingMiddleware() {
  const { performance } = require("perf_hooks");
  return function loggingMiddleware(req, res, next) {
    const time = new Date().toISOString();
    const start = performance.now();
    const { method, path } = req;
    res.on("finish", function () {
      const end = performance.now();
      const duration = `${(end - start).toFixed()}ms`;
      console.log(`${time} ${method} ${path} ${duration}`);
    });
    next();
  };
}

function apiMiddleware() {
  const api = require("~/api");
  return api;
}

function uiProxyMiddleware() {
  const middleware = express();
  middleware.use(waitUntilResolved(uiService));
  
  (async function () {
    const [ { port } ] = await uiService;
    const proxyMiddleware = proxy(`localhost:${port}`, {
      skipToNextHandlerFilter(proxyRes) {
        return proxyRes.statusCode === 404;
      },
      ws: true,
    });
    middleware.use(proxyMiddleware);
  })();
  
  return middleware;
}
