const { postCommentByArticleId } = require('../models/comments')

exports.newCommentByArticleId = (req, res, next) => {
    const newComment = req.body;
    postCommentByArticleId(newComment)
        .then(comment => {
            res.status(201).send(comment)
        })
        .catch(next)
}