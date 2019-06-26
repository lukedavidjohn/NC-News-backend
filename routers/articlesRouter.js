const express = require("express");
const articlesRouter = express.Router();
const { sendArticleById, updateArticleById } = require('../MVC/controllers/articles')

articlesRouter
    .route('/:article_id')
    .get(sendArticleById)
    .patch(updateArticleById)

module.exports = { articlesRouter }