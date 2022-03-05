const express = require("express");

const api = express();

api.get("/", (req, res, next) => {
  res.type("application/json");
  res.send(`Hello, World!`);
});

module.exports = api;
