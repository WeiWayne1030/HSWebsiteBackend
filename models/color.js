'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Color extends Model {
    static associate(models) {
      Color.belongsTo(models.Size, { foreignKey: 'SizeId' });
      Color.belongsTo(models.Item, { foreignKey: 'ItemId' });
      Color.hasMany(models.Cart, { foreignKey: 'ColorId' });
    }
      
  }
  Color.init({
    productNumber: DataTypes.STRING,
    name: DataTypes.STRING,
    itemStock: DataTypes.INTEGER,
    ItemId: DataTypes.INTEGER,
    SizeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Color',
    tableName: 'Colors'
  })
  return Color
}