const { fetchTopics } = require('../models/topics')

exports.sendTopics = (req, res, next) => {
    fetchTopics()
        .then(topics => {
            res.status(200).send({topics})})
        .catch(next);
}