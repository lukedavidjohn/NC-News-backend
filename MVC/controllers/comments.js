const { fetchCommentsByArticleId, postCommentByArticleId } = require('../models/comments')

exports.sendCommentsByArticleId = (req, res, next) => {
    fetchCommentsByArticleId(req.params)
        .then(comments => {
            console.log(comments)
            res.status(200).send(comments)
        })
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
