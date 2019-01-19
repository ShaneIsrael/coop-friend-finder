var Sequelize = require('sequelize')

var attributes = {
    subscription: {
        type: Sequelize.STRING,
        allowNull: false
    },
    term: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    startDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    endDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    autoRenews: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}

var options = {
    freezeTableName: true
}

module.exports.attributes = attributes
module.exports.options = options