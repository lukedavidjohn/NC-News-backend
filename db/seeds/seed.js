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
      bcrypt.genSalt(10, function(err, salt) {
        [...userData].forEach((user, idx, arr) => {
          bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
          });
        });
      });
      // hashedUserData.forEach((user, idx, arr) => {
      //   arr[idx].password = bcrypt.hashSync(user.password, salt);
      // });
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
