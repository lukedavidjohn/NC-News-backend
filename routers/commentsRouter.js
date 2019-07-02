const express = require("express");
const commentsRouter = express.Router({mergeParams: true});
const { updateCommentById, removeCommentById } = require('../MVC/controllers/comments')
const { handle405error } = require('../errors')

commentsRouter
    .route('/:comment_id')
    .patch(updateCommentById)
    .delete(removeCommentById)
    .all(handle405error)
    
module.exports = { commentsRouter }