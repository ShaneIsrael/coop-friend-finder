'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.dropTable('pendingRatings');
  },

  down: function (queryInterface, Sequelize) {
  }
};
