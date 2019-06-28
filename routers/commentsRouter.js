const express = require("express");
const commentsRouter = express.Router({mergeParams: true});
const { updateComment } = require('../MVC/controllers/comments')

commentsRouter
    .route('/:comment_id')
    .patch(updateComment)
    

module.exports = { commentsRouter }