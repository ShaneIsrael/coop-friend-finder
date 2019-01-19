var Model = require('../model/models.js')

module.exports.getUsernameById = function(id, callback) {
    Model.User.findOne({
        where: {
            id: id
        }
    }).then(function (row) {
        if (row) {
            callback(row.dataValues.username)
        } else {
            callback(null)
        }
    })
}