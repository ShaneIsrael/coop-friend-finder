var Sequelize = require('sequelize')

var attributes = {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: /^[a-z0-9\_\-]+$/i,
    }
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    }
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  adminLevel: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  isBanned: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  firstName: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
  salt: {
    type: Sequelize.STRING
  },
  pushNotificationChannel: {
    type: Sequelize.STRING,
    defaultValue: null
  }
}

var options = {
  freezeTableName: true
}

module.exports.attributes = attributes
module.exports.options = options
