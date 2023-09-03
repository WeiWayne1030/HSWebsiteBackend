'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      shipName: {
        type: Sequelize.STRING
      },
      orderNumber: {
        type: Sequelize.STRING
      },
      state:{
        type: Sequelize.STRING
      },
      UserId: {
        type: Sequelize.INTEGER
      },
      shipTel:{
        type: Sequelize.STRING
      },
      itemCount: {
        type: Sequelize.INTEGER
      },
      total: {
        type: Sequelize.INTEGER
      },
      MethodId: {
        type: Sequelize.INTEGER
      },
      address:{
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    })
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.dropTable('Orders')
  }
}