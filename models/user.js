'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Defining association with Transaction model
      User.hasMany(models.Transaction, { foreignKey: 'user_id', as: 'transactions' }); // Optional alias 'transactions'
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',  // Ensure the table name matches your DB table
    timestamps: true,    // This will create 'createdAt' and 'updatedAt' fields
    paranoid: true,      // If you want to enable soft deletes (optional)
  });

  return User;
};
