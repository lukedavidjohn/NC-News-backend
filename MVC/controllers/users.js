const {
  fetchUsers,
  fetchUserByUsername,
  postUser
} = require("../models/users");

exports.sendUsers = (req, res, next) => {
  fetchUsers().then(users => {
    res.status(200).send({ users });
  });
};

exports.sendUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then(user => {
      if (!user) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        res.status(200).send({ user });
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
