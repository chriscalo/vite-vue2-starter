const express = require("express");
const nocache = require("nocache");

const api = express();
api.use(nocache());

api.get("/", (req, res, next) => {
  res.type("application/json");
  res.send(`Hello, World!`);
});

api.get("/foo", (req, res, next) => {
  res.send("foo");
});

module.exports = api;
