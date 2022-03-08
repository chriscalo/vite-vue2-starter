const config = require("config");
const { getPort, run, registry } = require("~/util");

const PRODUCTION = process.env.NODE_ENV === "production";

(async function main() {
  console.log("Starting application…");
  
  const registryPort = await getPort(config.get("registry.port"));
  registry.start(registryPort);
  process.env.REGISTRY_PORT = registryPort;
  
  run("npm", "start --workspace=proxy");
  run("npm", "start --workspace=ui");
  run("npm", "start --workspace=api");
})();
