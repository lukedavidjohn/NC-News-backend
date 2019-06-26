const { fetchUsersById } = require('../models/users');

exports.sendUsersById = (req, res, next) => {
    fetchUsersById(req.params)
        .then(users => {
            if (users.length === 0) {
                return Promise.reject({status: 404, msg: "username not found"})
            }
            res.status(200).send(users[0])
        })
        .catch(next)
}