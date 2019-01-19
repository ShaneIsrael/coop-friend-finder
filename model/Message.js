var Sequelize = require('sequelize')

var attributes = {
    toUsername: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fromUsername: {
        type: Sequelize.STRING,
        allowNull: false
    },
    unread: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    subject: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}

var options = {
    freezeTableName: true
}

module.exports.attributes = attributes
module.exports.options = options