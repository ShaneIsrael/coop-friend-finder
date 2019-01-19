var Sequelize = require('sequelize')

var attributes = {
    type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'game'
    },
    serverHost: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
    },
    serverPort: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    serverName: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
    },
    serverCapacity: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
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
        type: Sequelize.STRING,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    voip: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    notes: {
        type: Sequelize.STRING
    },
    region: {
        type: Sequelize.STRING
    },
    timePlaying: {
        type: Sequelize.STRING
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
