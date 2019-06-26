const express = require("express");
const commentsRouter = express.Router();
const { addComment } = require('../MVC/controllers/comments')

module.exports = { commentsRouter }