const app = require('./app')

exports.handle400errors = (err, req, res, next) => {
    if (err.status === 400) { 
        res.status(400).send(err)
    } else if (err.status === 404) { 
        res.status(404).send(err)
    } else if (err.status === 405) { 
        res.status(405).send(err) 
    } else if (err.status === 422) {
        res.status(422).send(err)
    } else {
        next(err)
    }
}

exports.handlePsql400errors = (err, req, res, next) => {
    const psqlErrorCodes = ['22P02', '23503'];
    if (psqlErrorCodes.includes(err.code)) {
        res.status(400).send({msg: 'bad request'})
    } else {
        next(err)
    }
}

exports.handle500errors = (err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error" });
};
