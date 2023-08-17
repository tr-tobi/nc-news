const db = require("../db/connection");
const format = require("pg-format");

exports.sendTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => result.rows);
};

exports.sendArticles = () => {
  return db
    .query(
      `SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, COUNT(c.article_id)
    AS comment_count
    FROM articles a
    LEFT JOIN comments c ON a.article_id = c.article_id
    GROUP BY a.article_id
    ORDER BY a.created_at DESC`
    )
    .then((result) => result.rows);
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
exports.sendCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT comments.*
    FROM comments
    JOIN articles ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1;`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article does not exist",
        });
      }
      return result.rows;
    });
};

exports.insertCommentsByArticleId = (article_id, author, body) => {
  const votes = 0;
  const created_at = new Date();

  const insertCommentQuery = format(
    "INSERT INTO comments (article_id, author, body, votes, created_at) VALUES (%L) RETURNING *",
    [article_id, author, body, votes, created_at]
  );
  return db.query(insertCommentQuery).then((result) => {
    return result.rows[0];
  });
};
