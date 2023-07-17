'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.Stock, { foreignKey: 'StockId' })
    }
  }
  Cart.init({
    quantity: DataTypes.NUMBER,
    total: DataTypes.NUMBER,
    finalTotal: DataTypes.NUMBER,
    StockId: DataTypes.NUMBER,
  }, {
    sequelize,
    modelName: 'Cart',
    tableName: 'Carts'
  })
  return Cart
}