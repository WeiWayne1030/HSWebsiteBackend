'use strict'

const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Order, {foreignKey: 'UserId'})
      User.hasMany(models.Cart, {foreignKey: 'UserId'})
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
    introduction: DataTypes.STRING,
    role:DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users'
  })
  return User
}