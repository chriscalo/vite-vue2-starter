const config = require("config");
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { waitUntilResolved, listen } = require("../util");
const { connect } = require("./service-registry.js");

const { REGISTRY_PORT } = process.env;

const registry = connect(REGISTRY_PORT);
const server = express();

const apiService = registry.get("api");
const uiService = registry.get("ui");

server.use(loggingMiddleware());
server.use("/api", apiProxyMiddleware());
server.use(uiProxyMiddleware());

(async function main() {
  const port = config.get("server.port");
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
    const proxyMiddleware = createProxyMiddleware("/api", {
      target: `http://localhost:${port}`,
      pathRewrite: {
        "/api": "/",
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
    const proxyMiddleware = createProxyMiddleware({
      target: `http://localhost:${port}`,
      ws: true,
    });
    middleware.use(proxyMiddleware);
  })();
  
  return middleware;
}
