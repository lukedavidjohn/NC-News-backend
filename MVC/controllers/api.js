const endpoints = require("../../Docs/endpoints.json");

exports.sendEndpoints = (req, res, next) => {
  res.status(200).send({ endpoints: { endpoints } });
};
