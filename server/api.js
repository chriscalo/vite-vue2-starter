const config = require("config");
const api = require("../api");
const { getPort, listen } = require("../util");
const { connect } = require("./service-registry.js");

const { REGISTRY_PORT } = process.env;

(async function main() {
  const registry = connect(REGISTRY_PORT);
  const port = await getPort(config.get("api.port"));
  const { url } = await listen(api, port);
  console.log(`Application API server running: ${url}`);
  registry.register("api", { port });
})();
