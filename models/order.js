'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'UserId' }),
      Order.belongsTo(models.Method, { foreignKey: 'MethodId' }),
      Order.belongsTo(models.Cart, { foreignKey: 'orderNumber' });
    }
  }
  Order.init({
      shipName: DataTypes.STRING,
      orderNumber: DataTypes.STRING,
      state: DataTypes.BOOLEAN,
      UserId:  DataTypes.INTEGER,
      shipTel: DataTypes.STRING,
      MethodId: DataTypes.INTEGER,
      itemCount: DataTypes.INTEGER,
      total: DataTypes.INTEGER,
      address: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders'
  })
  return Order
}