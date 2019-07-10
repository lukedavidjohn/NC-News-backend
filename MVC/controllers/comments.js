const {
  checkCommentIdExists,
  fetchCommentsByArticleId,
  postCommentByArticleId,
  patchCommentById,
  deleteCommentById
} = require("../models/comments");
const { checkArticleIdExists } = require("../models/articles");

exports.sendCommentsByArticleId = (req, res, next) => {
  let { article_id } = req.params;
  let { sort_by, order, limit, p } = req.query;
  if (sort_by !== undefined) sort_by = sort_by.toLowerCase();
  if (order !== undefined) order = order.toLowerCase();
  if (limit === undefined) limit = 10;
  checkArticleIdExists(article_id)
    .then(articles => {
      if (articles.length) {
        fetchCommentsByArticleId(article_id, sort_by, order, limit, p)
          .then(comments => {
            res.status(200).send({ comments });
          })
          .catch(next);
      } else return Promise.reject({ status: 404, msg: "not found" });
    })
    .catch(next);
};

exports.createCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  postCommentByArticleId(article_id, newComment)
    .then(comments => {
      res.status(201).send({ comment: comments[0] });
    })
    .catch(next);
};

exports.updateCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  patchCommentById(comment_id, inc_votes)
    .then(comments => {
      if (!comments.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        res.status(200).send({ comment: comments[0] });
      }
    })
    .catch(next);
};

exports.removeCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  checkCommentIdExists(comment_id)
    .then(comments => {
      if (comments.length) {
        deleteCommentById(comment_id)
          .then(() => {
            res.sendStatus(204);
          })
          .catch(next);
      } else return Promise.reject({ status: 404, msg: "not found" });
    })
    .catch(next);
};
