const express = require("express");
const commentsRouter = express.Router({mergeParams: true});
const { newCommentByArticleId } = require('../MVC/controllers/comments')

commentsRouter
    .route('/')
    .post(newCommentByArticleId)

module.exports = { commentsRouter }