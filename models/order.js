'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.Item, { foreignKey: 'ItemId' }),
      Order.belongsTo(models.User, { foreignKey: 'UserId' })
    }
  }
  Order.init({
    ItemId: DataTypes.NUMBER,
    UserId: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders'
  })
  return Order
}