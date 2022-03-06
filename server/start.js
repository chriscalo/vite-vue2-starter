#!/usr/bin/env node
const config = require("config");
const { resolve } = require("path");
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

const UI_CWD = resolve(__dirname, "../ui");
const API_CWD = resolve(__dirname, "../api");

async function development() {
  run("npx", "nodemon server/proxy.js --ignore api/ --ignore ui/");
  run("npx", "node server.js", { cwd: UI_CWD });
  run("npx", "nodemon server.js", { cwd: API_CWD });
}

async function production() {
  run("npx", "node server/proxy.js");
  run("npx", "node server.js", { cwd: UI_CWD });
  run("npx", "node server.js", { cwd: API_CWD });
}

program.parse();
