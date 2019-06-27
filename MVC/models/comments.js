const { connection } = require("../../db/connection");

exports.postCommentByArticleId = (commentToInsert) => {
    return connection('comments')
        .insert(commentToInsert)
        .returning('*')        
}