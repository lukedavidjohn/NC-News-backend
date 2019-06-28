const { connection } = require("../../db/connection");

exports.fetchCommentsByArticleId = (article_id, sort_by, sort_order) => {
    if (sort_order === 'asc' || sort_order === 'desc' || sort_order === undefined) {
        return connection('comments')
            .select('*')
            .where({ article_id })
            .orderBy((sort_by || 'created_at'), (sort_order || 'ASC'))
        } else {
            return Promise.reject({status: 400, msg: "bad request"})
        }
}

exports.postCommentByArticleId = (article_id, newComment) => {
    return connection('articles')
        .select('article_id')
        .where({article_id})
        .then(article => {
            if(!article.length) {
                return Promise.reject({status: 422, msg: "unprocessable entity"})
            } else {
                return connection('comments')
                    .insert({
                        author: newComment.author,
                        article_id,
                        body: newComment.body
                    })
                    .returning('*')
                }
        })
}

exports.patchComment = (comment_id, inc_votes) => {
    return connection('comments')
        .where({comment_id})
        .increment({
            votes: inc_votes
        })
        .returning('*')
}