const { fetchArticles, fetchArticleById, patchArticleById } = require('../models/articles');

exports.sendArticles = (req, res, next) => {
    const { sort_by, order, author, topic } = req.query;
    let sort_column = sort_by
    if(sort_by !== undefined) {
        sort_column = sort_by.toLowerCase()
    }
    let sort_order = order
    if(order !== undefined) {
        sort_order = order.toLowerCase()
    }
    let filter_author = author;
    if (author !== undefined) {
        filter_author = author.toLowerCase()
    } else {
        filter_author = '%'
    };
    let filter_topic = topic;
    if (topic !== undefined) {
        filter_topic = topic.toLowerCase()
    } else {
        filter_topic = '%'
    }
    fetchArticles(sort_column, sort_order, filter_author, filter_topic)
        .then(articles => {
            if (!Object.keys(articles).length) {
                return Promise.reject({status: 404, msg: "not found"})
            } else {
            res.status(200).send(articles)
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