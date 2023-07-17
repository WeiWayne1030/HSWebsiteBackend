'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.Order, { foreignKey: 'OrderId' })
      Cart.belongsTo(models.User, { foreignKey: 'UserId' })
    }
  }
  Cart.init({
    orderQuantity: DataTypes.NUMBER,
    finalTotal: DataTypes.NUMBER,
    OrderId: DataTypes.NUMBER,
    UserId: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Cart',
    tableName: 'Carts'
  })
  return Cart
}