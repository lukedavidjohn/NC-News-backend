const { fetchTopics, postTopic } = require("../models/topics");

exports.sendTopics = (req, res, next) => {
  fetchTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.createTopic = (req, res, next) => {
  postTopic(req.body)
    .then(topics => {
      res.status(201).send({ topic: topics[0] });
    })
    .catch(next);
};
