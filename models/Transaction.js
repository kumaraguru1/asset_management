'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      // A Transaction is linked to an Asset
      Transaction.belongsTo(models.Asset, {
        foreignKey: 'asset_id',
        as: 'asset'
      });

      // A Transaction is performed by an Employee
      Transaction.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        as: 'employee'
      });
    }
  }

  Transaction.init({
    asset_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    transactionType: {
      type: DataTypes.ENUM('issue', 'return', 'scrap'),
      allowNull: false
    },
    issueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    returnDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    scrapDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Transaction',
    tableName: 'Transactions',
    timestamps: true,       // adds createdAt and updatedAt
    paranoid: true,         // adds deletedAt for soft deletes
    deletedAt: 'deletedAt'
  });

  return Transaction;
};
