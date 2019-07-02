const express = require("express");
const usersRouter = express.Router();
const { sendUsersById } = require('../MVC/controllers/users')
const { handle405error } = require('../errors')

usersRouter
    .route('/:username')
    .get(sendUsersById)
    .all(handle405error)

module.exports = { usersRouter };
