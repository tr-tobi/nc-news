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
      if (article !== undefined) {
        res.status(200).send({ article });
      } else {
        res.status(404).send({ msg: "Article does not exist" });
      }
    })
    .catch((err) => {
      next(err);
    });
};
