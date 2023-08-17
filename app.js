const express = require("express");
const {
  getTopics,
  getEndpoints,
  getArticles,
  getArticleByid,
  getCommentsByArticleId,
  patchArticleById,
  postCommentsByArticleId,
} = require("./controllers/controller");
const {
  handle400Errors,
  handleCustomErrors,
} = require("./controllers/errors.controller");

const app = express();
app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleByid);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.patch("/api/articles/:article_id", patchArticleById);
app.post("/api/articles/:article_id/comments", postCommentsByArticleId);

app.use((_, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use(handle400Errors);
app.use(handleCustomErrors);

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
