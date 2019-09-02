const {
  fetchUsers,
  fetchUsersByUsername,
  postUser
} = require("../models/users");

exports.sendUsers = (req, res, next) => {
  fetchUsers().then(users => {
    res.status(200).send({ users });
  });
};

exports.sendUsersByUsername = (req, res, next) => {
  fetchUsersByUsername(req.params)
    .then(users => {
      if (users.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        res.status(200).send({ user: users[0] });
      }
    })
    .catch(next);
};

exports.createUser = (req, res, next) => {
  postUser(req.body)
    .then(users => {
      res.status(201).send({ user: users[0] });
    })
    .catch(next);
};
