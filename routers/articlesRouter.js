const express = require("express");
const articlesRouter = express.Router({mergeParams: true});
const { sendArticles, sendArticleById, updateArticleById } = require('../MVC/controllers/articles')
const { sendCommentsByArticleId, createCommentByArticleId } = require('../MVC/controllers/comments')
const { handle405error } = require('../errors')

articlesRouter
    .route('/')
    .get(sendArticles)
    .all(handle405error)

articlesRouter
    .route('/:article_id')
    .get(sendArticleById)
    .patch(updateArticleById)
    .all(handle405error)

articlesRouter
    .route('/:article_id/comments')
    .get(sendCommentsByArticleId)
    .post(createCommentByArticleId)
    .all(handle405error)

module.exports = { articlesRouter }