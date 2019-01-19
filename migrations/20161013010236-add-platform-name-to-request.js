'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
        'requests',
        'platformUsername',
        {
          type: Sequelize.STRING
        }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('requests', 'platformUsername');
  }
};
