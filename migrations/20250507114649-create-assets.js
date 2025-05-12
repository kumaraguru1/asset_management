// migration: create-assets.js
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Assets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      unique_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      serial_number: Sequelize.STRING,
      make: Sequelize.STRING,
      model: Sequelize.STRING,
      category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'AssetCategories',
          key: 'id',
        },
      },
      purchase_date: Sequelize.DATE,
      status: Sequelize.STRING,
      description: Sequelize.TEXT,
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Assets');
  },
};