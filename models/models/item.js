'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      Item.belongsTo(models.Category, { foreignKey: 'CategoryId' })
      Item.hasMany(models.Stock),{ foreignKey: 'ItemId' }
      Item.hasMany(models.Order),{ foreignKey: 'ItemId' }
    }
  }
  Item.init({
    name: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    image: DataTypes.STRING,
    description: DataTypes.STRING,
    CategoryId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Item',
    tableName: 'Items'
  })
  return Item
}