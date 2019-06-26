const { connection } = require("../../db/connection");

exports.fetchUsersById = ({username}) => {
    return connection
        .select('*')
        .from('users')
        .where({username})
    }
