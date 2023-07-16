'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      Item.belongsToMany(models.User, {
        through: models.Order, 
        foreignKey: 'ItemId', 
        as: 'usersOrder'
      }),
      Item.belongsTo(models.Category, { foreignKey: 'CategoryId' })
    }
  }
  Item.init({
    name: DataTypes.STRING,
    amount: DataTypes.NUMBER,
    image: DataTypes.STRING,
    description: DataTypes.STRING,
    CategoryId: DataTypes.NUMBER,
  }, {
    sequelize,
    modelName: 'Item',
    tableName: 'Items'
  })
  return Item
}