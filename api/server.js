const config = require("config");
const api = require("./index.js");
const { getPort, listen } = require("~/util");
const { connect } = require("~/server/service-registry.js");

const { REGISTRY_PORT = 9090 } = process.env;

(async function main() {
  const registry = connect(REGISTRY_PORT);
  const port = await getPort(config.get("api.port"));
  const { url } = await listen(api, port);
  console.log(`Application API server running: ${url}`);
  registry.register("api", { port });
})();
