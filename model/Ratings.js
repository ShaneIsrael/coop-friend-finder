var Sequelize = require('sequelize')

var attributes = {
    rating: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    toUserId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}

var options = {
    freezeTableName: true
}

module.exports.attributes = attributes
module.exports.options = options