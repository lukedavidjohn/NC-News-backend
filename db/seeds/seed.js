const {
  topicData,
  articleData,
  commentData,
  userData
} = require('../index.js');

const { formatDate, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = function(knex, Promise) {
  return knex.migrate.rollback().then(() => {
    return knex.migrate.latest()
  })
  .then(()=> {
    const topicsInsertions = knex('topics').insert(topicData);
    const usersInsertions = knex('users').insert(userData);
    return Promise.all([topicsInsertions, usersInsertions])
  })
  .then(() => {
    const formattedArticleData = formatDate(articleData)
    return knex('articles').insert(formattedArticleData).returning('*')
  })
  .then((articleInsertions) => {
    const refObj = makeRefObj(articleInsertions);
    const formattedComments = formatComments(commentData, refObj);
    return knex('comments').insert(formattedComments).returning('*')
  })
};
