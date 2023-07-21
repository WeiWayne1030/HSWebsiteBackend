'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      Item.belongsTo(models.Category, { foreignKey: 'CategoryId' })
      Item.hasMany(models.Stock, { foreignKey: 'ItemId' })
    }
  }
  Item.init({
    name: DataTypes.STRING,
    state: DataTypes.BOOLEAN,
    price: DataTypes.DECIMAL,
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