const { connection } = require("../../db/connection");

exports.fetchTopics = () => {
  return connection.select("*").from("topics");
};

exports.postTopic = ({ slug, description }) => {
  return connection("topics")
    .insert({
      slug,
      description
    })
    .returning("*");
};
