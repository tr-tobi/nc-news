exports.handle400Errors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid id" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ msg: "Article does not exist" });
  } else {
    next(err);
  }
};
