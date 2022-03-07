const config = require("config");
const express = require("express");
const proxy = require("express-http-proxy");
const {
  waitUntilResolved,
  listen,
  registry: { connect },
} = require("~/util");

const { REGISTRY_PORT = 9090 } = process.env;

const registry = connect(REGISTRY_PORT);
const server = express();

const apiService = registry.get("api");
const uiService = registry.get("ui");

server.use(loggingMiddleware());
server.use("/api", apiProxyMiddleware());
server.use(uiProxyMiddleware());

(async function main() {
  const port = config.get("proxy.port");
  const { url } = await listen(server, port);
  console.log(`Application server running: ${url}`);
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

function apiProxyMiddleware() {
  const middleware = express();
  middleware.use(waitUntilResolved(apiService));
  
  (async function () {
    const [ { port } ] = await apiService;
    const proxyMiddleware = proxy(`localhost:${port}`, {
      skipToNextHandlerFilter(proxyRes) {
        return proxyRes.statusCode === 404;
      },
    });
    middleware.use(proxyMiddleware);
  })();
  
  return middleware;
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
