'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.Item, { foreignKey: 'itemId' }),
      Order.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Order.init({
    itemId: DataTypes.NUMBER,
    userId: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders'
  })
  return Order
}