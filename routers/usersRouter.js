const express = require("express");
const usersRouter = express.Router();
const { sendUsersById } = require('../MVC/controllers/users')

usersRouter
    .route('/:username')
    .get(sendUsersById)

module.exports = { usersRouter };
