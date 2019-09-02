const { signUser } = require("../models/users");

exports.authenticateUser = (req, res, next) => {
  signUser(req.body)
    .then(({ token }) => {
      res.status(201).send({ token });
    })
    .catch(next);
};
