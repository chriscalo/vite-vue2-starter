#!/usr/bin/env node
const config = require("config");
const { program } = require("commander");
const { run } = require("../util");
const registry = require("./service-registry");

const PRODUCTION = process.env.NODE_ENV === "production";
process.env.REGISTRY_PORT = config.get("registry.port");

program.name("app-start");
program.description("Starts the application");

program.action(async function () {
  console.log("Starting application…");
  registry.start(process.env.REGISTRY_PORT);
  
  if (!PRODUCTION) {
    development();
  } else {
    production();
  }
});

async function development() {
  run("npx", ["nodemon", "server/proxy.js"]);
  run("npx", ["node", "server/ui.js"]);
  run("npx", [
    "nodemon",
    "server/api.js",
    "--watch", "api",
    "--watch", "server/api.js",
  ]);
}

async function production() {
  run("npx", ["node", "server/proxy.js"]);
  run("npx", ["node", "server/ui.js"]);
  run("npx", ["node", "server/api.js"]);
}

program.parse();
