'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Size extends Model {
    static associate(models) {
      Size.hasMany(models.Stock, { foreignKey: 'SizeId' 
      })
      Size.belongsToMany(models.Color, {
        through: models.Stock, 
        foreignKey: 'SizeId', 
        as: 'stockSize'
      })
    }
  }
  Size.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Size',
    tableName: 'Sizes'
  })
  return Size
}