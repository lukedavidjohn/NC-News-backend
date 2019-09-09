const express = require("express");
const usersRouter = express.Router();
const {
  sendUsers,
  sendUserByUsername,
  createUser
} = require("../MVC/controllers/users");
const { handle405error } = require("../errors");

usersRouter
  .route("/")
  .get(sendUsers)
  .post(createUser)
  .all(handle405error);

usersRouter
  .route("/:username")
  .get(sendUserByUsername)
  .all(handle405error);

module.exports = { usersRouter };
