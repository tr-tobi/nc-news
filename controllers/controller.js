const {
  sendTopics,
  selectArticleById,
  sendArticles,
} = require("../models/model");
const endpoints = require("../endpoints.json");

exports.getEndpoints = (req, res) => {
  res.status(200).send({ endpoints });
};

exports.getTopics = (req, res) => {
  sendTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getArticles = (req, res) => {
  sendArticles().then((articles) => {
    for (let i = 0; i < articles[0].length; i++) {
      delete articles[0][i].body;
      articles[0][i].comment_count = +articles[1][i].comment_count;
    }
    const updatedArticles = articles[0];

    res.status(200).send({ updatedArticles });
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
