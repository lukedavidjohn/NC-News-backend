const express = require("express");
const usersRouter = express.Router();
const { sendUsersByUsername, createUser } = require("../MVC/controllers/users");
const { handle405error } = require("../errors");

usersRouter
  .route("/")
  .post(createUser)
  .all(handle405error);

usersRouter
  .route("/:username")
  .get(sendUsersByUsername)
  .all(handle405error);

module.exports = { usersRouter };
