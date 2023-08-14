exports.handle400Errors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid id" });
  } else {
    next(err);
  }
};
