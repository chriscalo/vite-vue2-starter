const path = require("path");
const fs = require("fs");
const { URL } = require("url");

const ALLOWLIST = [
  // internal requests
  /^\/__vite_ping/,
  /^\/@vite\/client/,
  /^\/@id/,
  /^\/__open-in-editor/,

  // no check needed
  /^\/$/,
  /^\/index.html/,
];

const PROJECT_ROOT = path.join(__dirname, "..");

// Source: https://stackoverflow.com/a/69711988/101869
function disableHistoryFallback() {
  return {
    name: "disable-history-fallback",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const { pathname } = new URL(req.url, `http://${req.headers.host}`);
        
        const isAllowed = ALLOWLIST.some(pattern => pattern.test(pathname));
        if (isAllowed) {
          return next();
        }
        
        const isFound = fs.existsSync(path.join(__dirname, "..", pathname));
        if (!isFound) {
          console.warn("URL not found:", pathname);
          notFound(req, res);
        } else {
          next();
        }
      });
    },
  };
}

function notFound(req, res) {
  const { method } = req;
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  res.statusCode = 404;
  res.setHeader("content-type", "text/html");
  res.end(`<pre>Cannot ${method} ${pathname}</pre>`);
}

module.exports = {
  disableHistoryFallback,
};
