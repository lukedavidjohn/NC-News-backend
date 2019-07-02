const { fetchCommentsByArticleId, postCommentByArticleId, patchCommentById, deleteCommentById } = require('../models/comments')

exports.sendCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    const {sort_by, order} = req.query;
    let sort_column = sort_by
    if(sort_by !== undefined) {
        sort_column = sort_by.toLowerCase()
    }
    let sort_order = order
    if(order !== undefined) {
        sort_order = order.toLowerCase()
    }
    fetchCommentsByArticleId(article_id, sort_column, sort_order)
        .then(comments => {
            if (comments.length === 0) {
                return Promise.reject({status: 404, msg: "not found"})
            } else {
                res.status(200).send({ comments })
            }
        })
        .catch(next)
}

exports.createCommentByArticleId = (req, res, next) => {
    const {article_id} = req.params
    const newComment = req.body;
    postCommentByArticleId(article_id, newComment)
        .then(comments => {
            res.status(201).send({comment: comments[0]})
        })
        .catch(next)
}

exports.updateCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body
    patchCommentById(comment_id, inc_votes)
        .then((comments) => {
            if (!comments.length) {
                return Promise.reject({status: 404, msg: 'not found'})
            } else {
                res.status(200).send({comment: comments[0]})
            }
        })
        .catch(next)
}

exports.removeCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    deleteCommentById(comment_id)
        .then(() => {
            res.sendStatus(204)
        })
        .catch(next)
}