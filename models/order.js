'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo (models.Cart, { foreignKey: 'CartId'})
      Order.belongsTo (models.User, { foreignKey: 'UserId' })
      Order.belongsTo(models.OrderInfo, { foreignKey: 'OrderInfoId'});
    }
  }
  Order.init({
    orderNumber: DataTypes.STRING,
    state: DataTypes.BOOLEAN,
    itemQuantity: DataTypes.NUMBER,
    OrderInfoId: DataTypes.NUMBER,
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