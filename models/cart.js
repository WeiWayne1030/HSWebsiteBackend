'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo (models.Color, { foreignKey: 'ColorId' })
      Cart.belongsTo (models.User, { foreignKey: 'UserId' })
      Cart.hasMany (models.Order, { foreignKey: 'CartId' })
    }
  }
  Cart.init({
    itemQuantity: DataTypes.DECIMAL,
    UserId: DataTypes.INTEGER,
    ColorId: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
  }, {
    sequelize,
    modelName: 'Cart',
    tableName: 'Carts'
  })
  return Cart
}