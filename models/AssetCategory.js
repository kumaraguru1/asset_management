'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AssetCategory extends Model {
    static associate(models) {
      // Asset must exist and have category_id as foreignKey
      AssetCategory.hasMany(models.Asset, {
        foreignKey: 'category_id',
        as: 'assets' // optional alias
      });
    }
  }

  AssetCategory.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'AssetCategory',
    tableName: 'AssetCategories',
    timestamps: true,     // adds createdAt and updatedAt
    paranoid: true,       // enables soft deletes using deletedAt
    deletedAt: 'deletedAt' // optional, only needed if you want to rename the default `deletedAt` field
  });

  return AssetCategory;
};
