const express = require("express");
const {
  getTopics,
  getEndpoints,
  getArticleByid,
} = require("./controllers/controller");
const { handle400Errors } = require("./controllers/errors.controller");

const app = express();

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleByid);

app.use(handle400Errors);

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
