exports.handle400errors = (err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send(err);
  } else if (err.status === 404) {
    res.status(404).send(err);
  } else if (err.status === 405) {
    res.status(405).send(err);
  } else if (err.status === 422) {
    res.status(422).send(err);
  } else {
    next(err);
  }
};

exports.handlePsql400errors = (err, req, res, next) => {
  const psqlErrorCodes = ["22P02", "23502", "23503", "42703"];
  if (psqlErrorCodes.includes(err.code)) {
    res.status(400).send({ msg: "bad request" });
  } else if (err.code === "23505") {
    res.status(422).send({ msg: "unprocessable entity" });
  } else {
    next(err);
  }
};

exports.handle405error = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
};

exports.handle500errors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
