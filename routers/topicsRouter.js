const express = require("express");
const topicsRouter = express.Router();
const { sendTopics } = require('../MVC/controllers/topics')

topicsRouter
    .route('/')
    .get(sendTopics)

module.exports = { topicsRouter };
