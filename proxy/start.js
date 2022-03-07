const { run } = require("~/util");

const PRODUCTION = process.env.NODE_ENV === "production";

(async function main() {
  console.log("Starting application proxy server…");
  
  if (!PRODUCTION) {
    development();
  } else {
    production();
  }
})();

async function development() {
  run("npx", "nodemon server.js");
}

async function production() {
  run("npx", "node server.js");
}
