'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    static associate(models) {
      Stock.belongsTo(models.Size, { foreignKey: 'SizeId' }),
      Stock.belongsTo(models.Color, { foreignKey: 'ColorId' })   
    }
  }
  Stock.init({
    quantity: DataTypes.NUMBER,
    ColorId: DataTypes.NUMBER,
    SizeId: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Stock',
    tableName: 'Stock'
  })
  return Stock
}