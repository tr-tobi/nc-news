const db = require("../db/connection");
const { formatComments } = require("../db/seeds/utils");

exports.sendTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => result.rows);
};

exports.sendArticles = () => {
  const articles = db
    .query("SELECT * FROM articles ORDER BY created_at DESC")
    .then((result) => result.rows);
  const commentCount = db
    .query(
      `SELECT COUNT(*)
    AS comment_count
    FROM articles
    GROUP BY article_id
    ORDER BY created_at DESC`
    )
    .then((result) => result.rows);
  return Promise.all([articles, commentCount]);
};

exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }
      return result.rows[0];
    });
};
