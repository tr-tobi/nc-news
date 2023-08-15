const { sendTopics, selectArticleById } = require("../models/model");
const endpoints = require("../endpoints.json");

exports.getEndpoints = (req, res) => {
  res.status(200).send({ endpoints });
};

exports.getTopics = (req, res) => {
  sendTopics().then((topic) => {
    res.status(200).send({ topic });
  });
};

exports.getArticleByid = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
