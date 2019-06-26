const { connection } = require("../../db/connection");

// exports.fetchArticleById = ({article_id}) => {
//     return connection
//         .select('*')
//         .from('articles')
//         .where({article_id})
// }

exports.fetchArticleById = ({article_id}) => {
    return connection
        .select('articles.*')
        .count({comment_count: 'articles.article_id'})
        .from('articles')
        .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
        .where({'articles.article_id': article_id})
        .groupBy('articles.article_id')
}

exports.patchArticleById = (update_id, update_value) => {
    return connection('articles')
       .where({article_id: update_id})
       .increment({
           votes: update_value
       })
       .returning('*')
}