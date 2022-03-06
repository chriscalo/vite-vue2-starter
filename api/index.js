const express = require("express");
const {foo} = require("~/foo");

const api = express();

api.get("/", (req, res, next) => {
  res.type("application/json");
  res.send(`Hello, World!`);
});

api.get("/foo", (req, res, next) => {
  res.send(foo());
});

module.exports = api;
