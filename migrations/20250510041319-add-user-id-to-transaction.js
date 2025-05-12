'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, check if the column exists and if not, add it.
    const columns = await queryInterface.describeTable('Transactions');
    
    if (!columns['user_id']) {
      await queryInterface.addColumn('Transactions', 'user_id', {
        type: Sequelize.INTEGER,
        allowNull: true,  // set to false if user_id should always be present
      });
    }

    // Add the foreign key constraint
    await queryInterface.addConstraint('Transactions', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_user_id',
      references: {
        table: 'users',  // Reference the 'Users' table
        field: 'id',     // Assuming the primary key is 'id' in the 'Users' table
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the foreign key constraint
    await queryInterface.removeConstraint('Transactions', 'fk_user_id');
    
    // Optionally, remove the 'user_id' column if you want to roll back the migration completely
    await queryInterface.removeColumn('Transactions', 'user_id');
  }
};
