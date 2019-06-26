const { fetchArticleById, patchArticleById } = require('../models/articles');

exports.sendArticleById = (req, res, next) => {
    fetchArticleById(req.params)
        .then(articles => {
            if (articles.length === 0) {
                return Promise.reject({status: 404, msg: "username not found"})
            }
            res.status(200).send(articles[0])
        })
    .catch(next)
}

exports.updateArticleById = (req, res, next) => {
    const {article_id} = req.params;
    const {votes} = req.body
    patchArticleById(article_id, votes)
        .then(articles => {
            if (articles.length === 0) {
                return Promise.reject({status: 404, msg: "username not found"})
            }
            res.status(200).send(articles[0])
        })
        .catch(next)
}