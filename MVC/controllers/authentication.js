const { fetchUsersByUsername } = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { KEY } = process.env;

exports.authenticateUser = (req, res, next) => {
  fetchUsersByUsername(req.body)
    .then(user => {
      if (!user) {
        return Promise.reject({
          status: 401,
          msg: "no user found with that username"
        });
      } else return bcrypt.compareSync(req.body.password, user.password);
    })
    .then(passwordMatch => {
      if (!passwordMatch) {
        return Promise.reject({
          status: 401,
          msg: "incorrect password"
        });
      } else return jwt.sign({ username: req.body.username }, KEY);
    })
    .then(token => {
      res.status(201).send({ token });
    })
    .catch(next);
};

// // if (!user) {
// //   return Promise.reject({
// //     status: 401,
// //     msg: "no user found with that username"
// //   });
// // }

// // // error hinges on whether passwordMatch is sync or async -
// // // if async, happy path passes and error-handling fails, if sync, vice versa
// // // unless there are one or zero previous tests, in which case all pass regardless
// // const passwordMatch = await bcrypt.compare(password, user.password);
// // if (!passwordMatch) {
// //   return Promise.reject({
// //     status: 401,
// //     msg: "incorrect password"
// //   });
// // }

// // const token = await jwt.sign({ username: user.username }, KEY);
// // if (token) return { token };
