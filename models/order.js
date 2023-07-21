'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'UserId' }),
      Order.hasMany(models.OrderInfo, { foreignKey: 'OrderId' }),
      Order.belongsTo(models.Cart, { foreignKey: 'CartId' })
    }
  }
  Order.init({
    state: DataTypes.BOOLEAN,
    itemQuantity: DataTypes.NUMBER,
    CartId: DataTypes.NUMBER,
    UserId: DataTypes.NUMBER,
    total: DataTypes.NUMBER,
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders'
  })
  return Order
}