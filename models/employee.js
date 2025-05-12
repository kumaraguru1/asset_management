'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      // Ensure 'Transaction' model exists and is correctly imported in models/index.js
      Employee.hasMany(models.Transaction, {
        foreignKey: 'employee_id',
        as: 'transactions' // Optional alias
      });
    }
  }

  Employee.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Please provide a valid email address"
        }
      }
    },
    branch: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Employee',
    tableName: 'Employees', // Table name in DB
    timestamps: true,       // createdAt and updatedAt
    paranoid: true,         // Enables soft delete via deletedAt
    deletedAt: 'deletedAt' // Explicitly defining the field for soft delete
  });

  return Employee;
};
