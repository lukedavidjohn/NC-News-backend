const express = require("express");
const apiRouter = express.Router();
const { sendEndpoints } = require("../MVC/controllers/api");
const { articlesRouter } = require("./articlesRouter");
const { authRouter } = require("./authRouter");
const { commentsRouter } = require("./commentsRouter");
const { topicsRouter } = require("./topicsRouter");
const { usersRouter } = require("./usersRouter");
const { handle405error } = require("../errors");

apiRouter
  .route("/")
  .get(sendEndpoints)
  .all(handle405error);

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/authenticate", authRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);

module.exports = { apiRouter };
