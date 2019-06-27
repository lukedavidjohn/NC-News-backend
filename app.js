const express = require("express");
const app = express();
const { apiRouter } = require("./routers/apiRouter");
const { handlePsql400errors, handle400errors, handle500errors } = require('./errors')

app.use(express.json())
app.use("/api", apiRouter);
app.use(handlePsql400errors)
app.use(handle400errors)
app.use(handle500errors)

module.exports = { app }