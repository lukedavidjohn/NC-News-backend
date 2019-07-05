const { fetchArticles, fetchArticleById, patchArticleById } = require('../models/articles');

exports.sendArticles = (req, res, next) => {
    let { sort_by, order, author, topic, limit, p } = req.query;
    if (sort_by !== undefined) sort_by = sort_by.toLowerCase()
    if (order !== undefined) order = order.toLowerCase()
    if (author !== undefined) author = author.toLowerCase()
      else author = '%';
    if (topic !== undefined) topic = topic.toLowerCase()
      else topic = '%'
    if (limit === undefined) limit = 10;
    if (p === undefined) p = 1;
    fetchArticles(sort_by, order, author, topic, limit, p)
        .then(articles => {
            if (!Object.keys(articles).length) {
                return Promise.reject({status: 404, msg: "not found"})
            } else {
            res.status(200).send({articles})
            }
        })
    .catch(next)
}

exports.sendArticleById = (req, res, next) => {
    fetchArticleById(req.params)
        .then(articles => {
            if (articles.length === 0) {
                return Promise.reject({status: 404, msg: "not found"})
            } else {
                res.status(200).send({article: articles[0]})
            }
        })
    .catch(next)
}

exports.updateArticleById = (req, res, next) => {
    const {article_id} = req.params;
    const {inc_votes} = req.body
    patchArticleById(article_id, inc_votes)
        .then(articles => {
            if (articles.length === 0) {
                return Promise.reject({status: 404, msg: "not found"})
            } else {
                return fetchArticleById({article_id: articles[0].article_id}) 
            }
        }).then((articles) => {
            res.status(200).send({article: articles[0]})
        })
        .catch(next)
}