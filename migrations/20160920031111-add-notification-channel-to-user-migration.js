'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
        'users',
        'pushNotificationChannel',
        {
          type: Sequelize.STRING,
          defaultValue: null
        }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'pushNotificationChannel');
  }
};
