'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Item, {
        through: models.Order,
        foreignKey: 'UserId',
        as: 'OrderItems'
      })
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    account: DataTypes.STRING,
    password: DataTypes.STRING,
    sex: DataTypes.STRING,
    telNumber: DataTypes.STRING,
    avatar: DataTypes.STRING,
    role:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users'
  })
  return User
}