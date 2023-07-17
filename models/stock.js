'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    static associate(models) {
      Stock.belongsTo(models.Size, { foreignKey: 'SizeId' })
      Stock.belongsTo(models.Color, { foreignKey: 'ColorId' })
      Stock.belongsTo(models.Item, { foreignKey: 'ItemId' })
    }
  }
  Stock.init({
    productNumber:DataTypes.STRING,
    itemstock: DataTypes.INTEGER,
    ColorId: DataTypes.INTEGER,
    SizeId: DataTypes.INTEGER,
    ItemId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Stock',
    tableName: 'Stock'
  })
  return Stock
}