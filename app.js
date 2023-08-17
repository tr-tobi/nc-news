const express = require("express");
const {
  getTopics,
  getEndpoints,
  getArticles,
  getArticleByid,
  getCommentsByArticleId,
  patchArticleById,
} = require("./controllers/controller");
const {
  handle400Errors,
  handleCustomErrors,
} = require("./controllers/errors.controller");

const app = express();

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleByid);
app.patch("/api/articles/:article_id", patchArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.use((_, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use(handle400Errors);
app.use(handleCustomErrors);

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
