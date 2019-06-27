const express = require("express");
const commentsRouter = express.Router({mergeParams: true});
const { sendCommentsByArticleId, newCommentByArticleId } = require('../MVC/controllers/comments')

commentsRouter
    .route('/')
    .get(sendCommentsByArticleId)
    .post(newCommentByArticleId)

module.exports = { commentsRouter }