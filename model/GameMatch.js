var Sequelize = require('sequelize')

var attributes = {
    accepterId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    accepterUsername: {
        type: Sequelize.STRING,
        allowNull: false
    },
    accepterPlatformUsername: {
        type: Sequelize.STRING,
        allowNull: false
    },
    accepterRatedUp: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    },
    requesterId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    requesterUsername: {
        type: Sequelize.STRING,
        allowNull: false
    },
    requesterPlatformUsername: {
        type: Sequelize.STRING,
        allowNull: false
    },
    requesterRatedUp: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    },
    game: {
        type: Sequelize.STRING,
        allowNull: false
    },
    platform: {
        type: Sequelize.STRING,
        allowNull: false
    },
    voiceServer: {
        type: Sequelize.STRING,
        allowNull: true
    },
    voiceServerPassword: {
        type: Sequelize.STRING,
        allowNull: true
    }
}

var options = {
    freezeTableName: true
}

module.exports.attributes = attributes
module.exports.options = options