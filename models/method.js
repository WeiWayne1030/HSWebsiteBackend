'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Method extends Model {
    static associate(models) {
      Method.hasMany(models.OrderInfo, { foreignKey: 'MethodId' })
    }
  }
  Method.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Method',
    tableName: 'Methods'
  })
  return Method
}