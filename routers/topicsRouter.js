const express = require("express");
const topicsRouter = express.Router();
const { sendTopics, createTopic } = require("../MVC/controllers/topics");
const { handle405error } = require("../errors");

topicsRouter
  .route("/")
  .get(sendTopics)
  .post(createTopic)
  .all(handle405error);

module.exports = { topicsRouter };
