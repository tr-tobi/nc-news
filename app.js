const express = require("express");
const { getTopics, getEndpoints } = require("./controllers/controller");

const app = express();

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
