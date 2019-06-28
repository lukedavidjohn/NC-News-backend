const express = require("express");
const articlesRouter = express.Router({mergeParams: true});
const { sendArticles, sendArticleById, updateArticleById } = require('../MVC/controllers/articles')
const { sendCommentsByArticleId, newCommentByArticleId } = require('../MVC/controllers/comments')

articlesRouter
    .route('/')
    .get(sendArticles)

articlesRouter
    .route('/:article_id')
    .get(sendArticleById)
    .patch(updateArticleById)

articlesRouter
    .route('/:article_id/comments')
    .get(sendCommentsByArticleId)
    .post(newCommentByArticleId)

module.exports = { articlesRouter }