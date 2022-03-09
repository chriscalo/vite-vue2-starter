const { run } = require("~/util");

const PRODUCTION = process.env.NODE_ENV === "production";

console.log("Starting application proxy server…");
  
if (!PRODUCTION) {
  run("npx", "nodemon server.js");
} else {
  run("npx", "node server.js");
}
