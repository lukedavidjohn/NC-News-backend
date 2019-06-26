const app = require('./app')

exports.handle404errors = (err, req, res, next) => {
    if (err.status === 404) res.status(404).send(err)
}
