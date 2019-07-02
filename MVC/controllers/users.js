const { fetchUsersById } = require('../models/users');

exports.sendUsersById = (req, res, next) => {
    fetchUsersById(req.params)
        .then(users => {
            if (users.length === 0) {
                return Promise.reject({status: 404, msg: "not found"})
            } else {
                res.status(200).send({user: users[0]})
            }
        })
        .catch(next)
}