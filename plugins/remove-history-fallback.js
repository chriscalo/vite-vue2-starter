const express = require("express");
const { join } = require("path");
const { readFile } = require("fs/promises");

const PROJECT_ROOT = join(__dirname, "..");

function removeHistoryFallback() {
  return {
    name: "remove-history-fallback",
    configureServer(server) {
      return function () {
        removeViteSpaFallbackMiddleware(server.middlewares);
        server.middlewares.use(transformHtmlMiddleware(server));
        server.middlewares.use(notFoundMiddleware());
      };
    },
  };
}

function removeViteSpaFallbackMiddleware(middlewares) {
  const { stack } = middlewares;
  const index = stack.findIndex(function (layer) {
    const { handle: fn } = layer;
    return fn.name === "viteSpaFallbackMiddleware";
  });
  if (index > -1) {
    stack.splice(index, 1);
  } else {
    throw Error("viteSpaFallbackMiddleware() not found in server middleware");
  }
}

function transformHtmlMiddleware(server) {
  // use express for its convenience methods
  const middleware = express();
  middleware.use(async (req, res, next) => {
    try {
      const rawHtml = await getIndexHtml(req.path);
      const transformedHtml = await server.transformIndexHtml(
        req.url, rawHtml, req.originalUrl
      );
      
      res.set(server.config.server.headers);
      res.send(transformedHtml);
    } catch (error) {
      return next(error);
    }
  });
  
  // named function for easier debugging
  return function customViteHtmlTransformMiddleware(req, res, next) {
    middleware(req, res, next);
  };
}

async function getIndexHtml(path) {
  const indexPath = join(PROJECT_ROOT, path, "index.html");
  return readFile(indexPath, "utf-8");
}

function notFoundMiddleware() {
  // use express for its convenience methods
  const middleware = express();
  middleware.use((req, res) => {
    const { method, path } = req;
    res.status(404);
    res.type("html");
    res.send(`<pre>Cannot ${method} ${path}</pre>`);
  });
  return function customNotFoundMiddleware(req, res, next) {
    middleware(req, res, next);
  };
}

module.exports = {
  removeHistoryFallback,
};
