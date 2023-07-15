'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      Item.belongsToMany(models.User, {
        through: models.Order, 
        foreignKey: 'itemId', 
        as: 'usersOrder'
      }),
      Item.belongsTo(models.Color, { foreignKey: 'ColorId' }),
      Item.belongsTo(models.Category, { foreignKey: 'CategoryId' })
    }
  }
  Item.init({
    itemNumber: DataTypes.STRING,
    name: DataTypes.STRING,
    amount: DataTypes.NUMBER,
    stock: DataTypes.NUMBER,
    image: DataTypes.STRING,
    description: DataTypes.STRING,
    categoryId: DataTypes.NUMBER,
    colorId: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Item',
    tableName: 'Items'
  })
  return Item
}