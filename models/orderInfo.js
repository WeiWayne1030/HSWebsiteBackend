'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class OrderInfo extends Model {
    static associate(models) {
      OrderInfo.belongsTo(models.User, { foreignKey: 'UserId' }),
      OrderInfo.belongsTo(models.Method, { foreignKey: 'MethodId' }),
      OrderInfo.belongsTo(models.Order, { foreignKey: 'OrderId' })
    }
  }
  OrderInfo.init({
    orderNumber: DataTypes.STRING,
      shipName: DataTypes.STRING,
      UserId:  DataTypes.INTEGER,
      shipTel: DataTypes.STRING,
      MethodId: DataTypes.INTEGER,
      OrderId: DataTypes.INTEGER,
      address: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'OrderInfo',
    tableName: 'OrderInfos'
  })
  return OrderInfo
}