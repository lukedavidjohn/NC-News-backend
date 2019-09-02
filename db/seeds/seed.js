const bcrypt = require("bcryptjs");
const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../index.js");

const { formatDate, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex, Promise) {
  return knex.migrate
    .rollback()
    .then(() => {
      return knex.migrate.latest();
    })
    .then(() => {
      const topicsInsertions = knex("topics").insert(topicData);
      bcrypt.genSalt(10, (err, salt) => {
        [...userData].forEach(user => {
          bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
          });
        });
      });
      const usersInsertions = knex("users").insert(userData);
      return Promise.all([topicsInsertions, usersInsertions]);
    })
    .then(() => {
      const formattedArticleData = formatDate(articleData);
      return knex("articles")
        .insert(formattedArticleData)
        .returning("*");
    })
    .then(articleInsertions => {
      const refObj = makeRefObj(articleInsertions);
      const formattedComments = formatComments(commentData, refObj);
      return knex("comments")
        .insert(formattedComments)
        .returning("*");
    });
};
