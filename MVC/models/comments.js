const { connection } = require("../../db/connection");

exports.fetchCommentsByArticleId = ({ article_id }) => {
    return connection('comments')
        .select('*')
        .where({ article_id })
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