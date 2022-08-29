const express = require("express");
const server = express();

server.use(express.urlencoded({ extended: false }));
server.use(express.json());

server.use("/", require("./router"));

module.exports = server;
