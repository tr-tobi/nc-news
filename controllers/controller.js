const { sendTopics } = require("../models/model");

exports.getTopics = (req, res) => {
  sendTopics()
    .then((topic) => {
      res.status(200).send({ topic });
    })
    .catch((err) => {
      next(err);
    });
};
