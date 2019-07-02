const express = require("express");
const topicsRouter = express.Router();
const { sendTopics } = require('../MVC/controllers/topics')
const { handle405error } = require('../errors')

topicsRouter
    .route('/')
    .get(sendTopics)
    .all(handle405error)

module.exports = { topicsRouter };
