const express = require("express");

const api = require("../api");
const ui = require("./ui.js");

const server = express();
server.use("/api", api);
server.use(ui);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log();
  console.log(`Server running at:`);
  console.log(`http://localhost:${PORT}/`);
  console.log();
});
