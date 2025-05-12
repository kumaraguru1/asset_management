module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Assets', 'assigned_to', {
      type: Sequelize.INTEGER, // or Sequelize.STRING depending on your use case
      allowNull: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Assets', 'assigned_to');
  }
};
