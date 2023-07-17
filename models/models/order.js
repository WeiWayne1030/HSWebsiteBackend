'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.Stock, { foreignKey: 'StockId' }),
      Order.belongsTo(models.User, { foreignKey: 'UserId' })
    }
  }
  Order.init({
    orderNumber: DataTypes.STRING,
    state: DataTypes.BOOLEAN,
    itemQuantity: DataTypes.NUMBER,
    StockId: DataTypes.NUMBER,
    UserId: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders'
  })
  return Order
}