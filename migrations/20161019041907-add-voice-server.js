'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn(
          'listings',
          'voiceServer',
          {
            type: Sequelize.STRING,
            allowNull: true,
          }
      ),
      queryInterface.addColumn(
          'listings',
          'voiceServerPassword',
          {
            type: Sequelize.STRING,
            allowNull: true
          }
      ),
      queryInterface.addColumn(
          'gameMatch',
          'voiceServer',
          {
            type: Sequelize.STRING,
            allowNull: true,
          }
      ),
      queryInterface.addColumn(
          'gameMatch',
          'voiceServerPassword',
          {
            type: Sequelize.STRING,
            allowNull: true
          }
      )]
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('listings', 'voiceServer'),
      queryInterface.removeColumn('listings', 'voiceServerPassword'),
      queryInterface.removeColumn('gameMatch', 'voiceServer'),
      queryInterface.removeColumn('gameMatch', 'voiceServerPassword'),
    ]
  }
};
