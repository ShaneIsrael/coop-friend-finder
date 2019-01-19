'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn(
        'listings',
        'type',
        {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'game'
        }
      ),
      queryInterface.addColumn(
          'listings',
          'serverHost',
          {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null
          }
      ),
      queryInterface.addColumn(
          'listings',
          'serverPort',
          {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null
          }
      ),
      queryInterface.addColumn(
          'listings',
          'serverName',
          {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null
          }
      ),
      queryInterface.addColumn(
          'listings',
          'serverCapacity',
          {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null
          }
      )]
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('listings', 'type'),
      queryInterface.removeColumn('listings', 'serverHost'),
      queryInterface.removeColumn('listings', 'serverPort'),
      queryInterface.removeColumn('listings', 'serverName'),
      queryInterface.removeColumn('listings', 'serverCapacity')
    ]
  }
};
