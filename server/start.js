const config = require("config");
const { run, registry } = require("~/util");

const PRODUCTION = process.env.NODE_ENV === "production";
process.env.REGISTRY_PORT = config.get("registry.port");

(async function main() {
  console.log("Starting application…");
  registry.start(process.env.REGISTRY_PORT);
  
  run("npm", "start --workspace=proxy");
  run("npm", "start --workspace=ui");
  run("npm", "start --workspace=api");
})();
