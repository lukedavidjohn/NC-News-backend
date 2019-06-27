const { fetchArticleById, patchArticleById } = require('../models/articles');

exports.sendArticleById = (req, res, next) => {
    fetchArticleById(req.params)
        .then(articles => {
            if (articles.length === 0) {
                return Promise.reject({status: 404, msg: "not found"})
            } else {
                res.status(200).send(articles[0])
            }
        })
    .catch(next)
}

exports.updateArticleById = (req, res, next) => {
    const {article_id} = req.params;
    const {votes} = req.body
    patchArticleById(article_id, votes)
        .then(articles => {
            if (articles.length === 0) {
                return Promise.reject({status: 404, msg: "not found"})
            } else {
                return fetchArticleById({article_id: articles[0].article_id}) 
            }
        }).then((articles) => {
            res.status(200).send(articles[0])
        })
        .catch(next)
}