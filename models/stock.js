'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    static associate(models) {
      Stock.belongsTo(models.Color, { foreignKey: 'ColorId' });
      Stock.belongsTo(models.Item, { foreignKey: 'ItemId' });
      Stock.hasMany(models.Cart, { foreignKey: 'StockId' });
    }
  }

  Stock.init(
    {
      productNumber: DataTypes.STRING,
      ColorId: DataTypes.INTEGER,
      ItemId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Stock',
      tableName: 'Stocks',
    }
  );

  return Stock;
};