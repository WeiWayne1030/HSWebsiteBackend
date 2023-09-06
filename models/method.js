'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Method extends Model {
    static associate(models) {
      Method.hasMany(models.Order, { foreignKey: 'MethodId' })
    }
  }
  Method.init({
    name: DataTypes.STRING,
    state: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Method',
    tableName: 'Methods'
  })
  return Method
}