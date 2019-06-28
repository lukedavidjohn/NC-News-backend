const { connection } = require("../../db/connection");

exports.fetchCommentsByArticleId = (article_id, sort_by, order) => {
    return connection('comments')
        .select('*')
        .where({ article_id })
        .orderBy((sort_by || 'created_at'), order)
}

exports.postCommentByArticleId = (article_id, newComment) => {
    return connection('articles')
        .select('article_id')
        .where({article_id})
        .then((article) => {
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