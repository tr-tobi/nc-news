const express = require("express");
const { getTopics } = require("./controllers/controller");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  console.log(err);
  next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;