'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class OrderInfo extends Model {
    static associate(models) {
      OrderInfo.belongsTo(models.User, { foreignKey: 'UserId' }),
      OrderInfo.belongsTo(models.Method, { foreignKey: 'MethodId' }),
      OrderInfo.hasOne(models.Order, { foreignKey: 'orderInfo' });
    }
  }
  OrderInfo.init({
      shipName: DataTypes.STRING,
      orderNumber: DataTypes.STRING,
      UserId:  DataTypes.INTEGER,
      shipTel: DataTypes.STRING,
      MethodId: DataTypes.INTEGER,
      total: DataTypes.INTEGER,
      address: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'OrderInfo',
    tableName: 'OrderInfos'
  })
  return OrderInfo
}