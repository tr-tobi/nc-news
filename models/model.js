const db = require("../db/connection");

exports.sendTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => result.rows);
};
