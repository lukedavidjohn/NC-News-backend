const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { connection } = require("../../db/connection");
const { KEY } = process.env;

exports.fetchUsers = () => {
  return connection("users").select("*");
};

exports.fetchUsersByUsername = ({ username }) => {
  return connection
    .select("*")
    .from("users")
    .where({ username });
};

exports.postUser = ({ username, password, avatar_url, name }) => {
  return connection("users")
    .insert({
      username,
      password,
      avatar_url,
      name
    })
    .returning("*");
};

exports.signUser = async ({ username, password }) => {
  const user = await connection("users")
    .first("*")
    .where({ username })
    .returning("*");
  if (!user) {
    return Promise.reject({
      status: 401,
      msg: "no user found with that username"
    });
  }
  const passwordMatch = bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return Promise.reject({ status: 401, msg: "incorrect password" });
  }
  const token = jwt.sign({ username: user.username }, KEY);
  return { token, user };
};
