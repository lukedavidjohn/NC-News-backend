const { connection } = require("../../db/connection");

exports.fetchUsers = () => {
  return connection("users").select("*");
};

exports.fetchUserByUsername = username => {
  return connection
    .first("*")
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
