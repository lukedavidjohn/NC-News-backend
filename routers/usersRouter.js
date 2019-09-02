const express = require("express");
const usersRouter = express.Router();
const {
  sendUsers,
  sendUsersByUsername,
  createUser,
  authenticateUser
} = require("../MVC/controllers/users");
const { handle405error } = require("../errors");

usersRouter
  .route("/")
  .get(sendUsers)
  .post(createUser)
  .all(handle405error);

usersRouter
  .route("/:username")
  .get(sendUsersByUsername)
  .all(handle405error);

module.exports = { usersRouter };
