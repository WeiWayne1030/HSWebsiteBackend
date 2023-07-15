'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Color extends Model {
    static associate(models) {
      Color.hasMany(models.Item, { foreignKey: 'ColorId' 
      })
    }
  }
  Color.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Color',
    tableName: 'Colors'
  })
  return Color
}