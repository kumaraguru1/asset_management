'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Employees', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'changeme123',
      after: 'email'
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Employees', 'password');
  }
};
