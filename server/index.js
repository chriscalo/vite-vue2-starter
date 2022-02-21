const express = require("express");
const { listen } = require("listhen");

const api = require("../api");
const ui = require("./ui.js");

const server = express();
server.use("/api", api);
server.use(ui);

listen(server);
