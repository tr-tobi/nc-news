exports.handle400Errors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid id" });
  } else if (
    err.code === "23502" ||
    (err.status === 400 && err.msg === "Bad Request")
  ) {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503" && err.detail.includes("author")) {
    res.status(400).send({ msg: "Invalid Username" });
  } else if (err.code === "23502" && err.detail.includes("Failing")) {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.status === 404 && err.msg === "Not Found") {
    res.status(404).send({ msg: "Not Found" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (
    err.status === 404 ||
    (err.code === "23503" && err.detail.includes("article_id"))
  ) {
    res.status(404).send({ msg: "Article does not exist" });
  } else {
    next(err);
  }
};
