const { connection } = require("../../db/connection");

exports.checkCommentIdExists = comment_id => {
  return connection("comments")
    .first("comment_id")
    .where({ comment_id });
};

exports.fetchCommentsByArticleId = (
  article_id,
  sort_by,
  sort_order,
  limit_to,
  page
) => {
  if (
    sort_order === "asc" ||
    sort_order === "desc" ||
    sort_order === undefined
  ) {
    let offset = (page - 1) * limit_to;
    return connection("comments")
      .select("*")
      .where({ article_id })
      .orderBy(sort_by || "created_at", sort_order || "DESC")
      .limit(limit_to)
      .offset(offset);
  } else {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
};

exports.postCommentByArticleId = (article_id, { username, body }) => {
  return connection("articles")
    .select("article_id")
    .where({ article_id })
    .then(article => {
      if (!article.length) {
        return Promise.reject({ status: 422, msg: "unprocessable entity" });
      } else {
        return connection("comments")
          .insert({
            author: username,
            article_id,
            body
          })
          .returning("*");
      }
    });
};

exports.patchCommentById = (comment_id, inc_votes) => {
  if (!inc_votes) {
    return connection("comments")
      .select("*")
      .where({ comment_id });
  } else {
    return connection("comments")
      .where({ comment_id })
      .increment({
        votes: inc_votes
      })
      .returning("*");
  }
};

exports.deleteCommentById = comment_id => {
  return connection("comments")
    .where({ comment_id })
    .del()
    .returning("*");
};
