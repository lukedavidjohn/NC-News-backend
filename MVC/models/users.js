const { connection } = require("../../db/connection");

exports.fetchUsers = () => {
  return connection("users").select("*");
};

exports.fetchUsersByUsername = ({ username }) => {
  return connection
    .select("*")
    .from("users")
    .where({ username });
};

exports.postUser = ({ username, avatar_url, name }) => {
  return connection("users")
    .insert({
      username,
      avatar_url,
      name
    })
    .returning("*");
};
