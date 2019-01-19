var Sequelize = require('sequelize')

var attributes = {
    toUserId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    toUsername: {
        type: Sequelize.STRING,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    game: {
        type: Sequelize.STRING,
        allowNull: false
    },
    platform: {
        type: Sequelize.STRING,
        allowNull: false
    },
    platformUsername: {
        type: Sequelize.STRING
    }
}

var options = {
    freezeTableName: true
}

module.exports.attributes = attributes
module.exports.options = options