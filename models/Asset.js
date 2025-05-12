'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Asset extends Model {
    static associate(models) {
      // Each Asset belongs to one AssetCategory
      Asset.belongsTo(models.AssetCategory, {
        foreignKey: 'category_id',
        as: 'category'
      });

      // Each Asset may be assigned to one Employee
      Asset.belongsTo(models.Employee, {
        foreignKey: 'assigned_to',
        as: 'employee'
      });

      // Each Asset can have many Transactions
      Asset.hasMany(models.Transaction, {
        foreignKey: 'asset_id',
        as: 'transactions'
      });
    }
  }

  Asset.init({
    unique_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    serial_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    make: {
      type: DataTypes.STRING,
      allowNull: true
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    purchase_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'available'
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    branch: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Asset',
    tableName: 'Assets',
    timestamps: true,       // createdAt and updatedAt
    paranoid: true,         // enables soft deletes using deletedAt
    deletedAt: 'deletedAt'  // optional override of default field name
  });

  return Asset;
};
