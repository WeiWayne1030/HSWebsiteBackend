'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Size extends Model {
    static associate(models) {
      Size.hasMany(models.Color, { foreignKey: 'SizeId' 
      })
    }
  }
  Size.init({
    name: DataTypes.STRING,
    state: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Size',
    tableName: 'Sizes'
  })
  return Size
}