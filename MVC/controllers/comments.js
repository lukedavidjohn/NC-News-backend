const { fetchCommentsByArticleId, postCommentByArticleId } = require('../models/comments')

exports.sendCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    const {sort_by, order} = req.query;
    fetchCommentsByArticleId(article_id, sort_by, order)
        .then(comments => {  
            if (comments.length === 0) {
                return Promise.reject({status: 404, msg: "not found"})
            } else {
                res.status(200).send({ comments })
            }
        })
        .catch(next)
}

exports.newCommentByArticleId = (req, res, next) => {
    const {article_id} = req.params
    const newComment = req.body;
    postCommentByArticleId(article_id, newComment)
        .then(comments => {
                if (!Object.keys(newComment).length) {
                    return Promise.reject({status: 400, msg: 'bad request'})
                } else {
                    res.status(201).send(comments[0])
                }
        })
        .catch(next)
}
