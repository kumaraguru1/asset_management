module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Assets', 'value', {
      type: Sequelize.DECIMAL, // or Sequelize.INTEGER or Sequelize.FLOAT
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Assets', 'value');
  }
};
