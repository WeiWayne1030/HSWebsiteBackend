'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Item, { foreignKey: 'CategoryId' })
    }
  }
  Category.init({
    name: DataTypes.STRING,
    state: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'Categories'
  })
  return Category
}