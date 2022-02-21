const express = require("express");

const api = express();

api.use("/", (req, res, next) => {
  res.type("application/json");
  res.send(`Hello, World!`);
});

module.exports = api;
