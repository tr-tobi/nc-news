const db = require("../db/connection");
const testTopics = require("../db/data/test-data/topics");
const devTopics = require("../db/data/development-data/topics");

exports.sendTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => result.rows);
};

exports.sendUsers = () => {
  return db.query("SELECT * FROM users").then((result) => result.rows);
};

exports.sendArticles = (topic, sort_by = "created_at", order = "desc") => {
  const acceptedSort = [
    "title",
    "topic",
    "author",
    "created_at",
    "article_img_url",
  ];
  const acceptedOrder = ["asc", "desc"];
  if (!acceptedSort.includes(sort_by) || !acceptedOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  const uniqueTopics = [];
  testTopics.forEach((item) => {
    if (!uniqueTopics.includes(item.slug)) {
      uniqueTopics.push(item.slug);
    }
  });

  const queryValues = [];
  let queryStr = `SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, 
  CAST(COUNT(c.article_id) AS INT) AS comment_count
  FROM articles a
  LEFT JOIN comments c ON a.article_id = c.article_id`;

  if (topic) {
    if (uniqueTopics.includes(topic)) {
      queryValues.push(topic);
      queryStr += ` WHERE a.topic = $1`;
    } else {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
  }

  return db
    .query(
      queryStr + ` GROUP BY a.article_id ORDER BY ${sort_by} ${order}`,
      queryValues
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT a.*, COALESCE(CAST(c.comment_count AS INT), 0) AS comment_count
      FROM articles a
      LEFT JOIN (SELECT article_id, CAST(COUNT(*) AS INT) AS comment_count
    FROM comments
    GROUP BY article_id) 
    c ON a.article_id = c.article_id
    WHERE a.article_id = $1;`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }
      return result.rows[0];
    });
};

exports.updateArticleById = (inc_votes, article_id) => {
  return db
    .query(
      `
      UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *;
    `,
      [inc_votes, article_id]
    )
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
  return db
    .query(
      "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *",
      [article_id, author, body]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
  return db.query("DELETE FROM comments WHERE comment_id = $1;", [comment_id]);
};
