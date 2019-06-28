const { fetchCommentsByArticleId, postCommentByArticleId, patchComment } = require('../models/comments')

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

exports.updateComment = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body
    patchComment(comment_id, inc_votes)
        .then((comment) => {
            res.status(200).send({comment: comment[0]})
        })
}