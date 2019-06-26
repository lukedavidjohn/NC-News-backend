const express = require("express");
const app = express();
const { apiRouter } = require("./routers/apiRouter");
const { handle404errors } = require('./errors')

app.use(express.json())
app.use("/api", apiRouter);
app.use(handle404errors)

module.exports = { app }