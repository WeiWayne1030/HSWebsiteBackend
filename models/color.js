'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Color extends Model {
    static associate(models) {
      Color.hasMany(models.Stock, { foreignKey: 'ColorId' 
      })
      Color.belongsTo(models.Size, { foreignKey: 'SizeId' });
    }
  }
  Color.init({
    name: DataTypes.STRING,
    itemStock: DataTypes.INTEGER,
    SizeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Color',
    tableName: 'Colors'
  })
  return Color
}