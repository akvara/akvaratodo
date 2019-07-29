"use strict";

const express = require("express");
const config = require("./config/main");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const taskListRoutes = require("./api/routes/taskListRoutes");
const taskListModel = require("./api/models/taskListModel");
const userSettingsRoutes = require("./api/routes/userSettingsRoutes");
const userSettingsModel = require("./api/models/userSettingsModel");

const app = express();

mongoose.Promise = global.Promise;
console.log("Connecting to server:", config.server);
mongoose.connect(config.server, function(error) {
  if (error) console.error(error);
  else console.log("mongo connected");
});

app
  .use(bodyParser.json()) // support json encoded bodies
  .use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
  .use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");

    next();
  });

taskListRoutes(app);
userSettingsRoutes(app);

app.listen(config.port);

console.log("todo list RESTful API server started on: " + config.port);
