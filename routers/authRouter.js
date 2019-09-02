const express = require("express");
const authRouter = express.Router();
const { authenticateUser } = require("../MVC/controllers/users");
const { handle405error } = require("../errors");

authRouter
  .route("/")
  .post(authenticateUser)
  .all(handle405error);

module.exports = { authRouter };
