var Sequelize = require('sequelize')

var attributes = {
    email: {
        type: Sequelize.STRING
    },
    phone: {
        type: Sequelize.STRING
    }
}

var options = {
    freezeTableName: true
}

module.exports.attributes = attributes
module.exports.options = options