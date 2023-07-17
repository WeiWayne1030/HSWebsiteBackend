'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Color extends Model {
    static associate(models) {
      Color.hasMany(models.Stock, { foreignKey: 'ColorId' 
      })
      Color.belongsToMany(models.Size, {
        through: models.Stock, 
        foreignKey: 'ColorId', 
        as: 'stockColor'
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