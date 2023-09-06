'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Colors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productNumber: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      itemStock: {
        type: Sequelize.INTEGER
      },
      state: {
        type: Sequelize.BOOLEAN
      },
      SizeId: {
        type: Sequelize.INTEGER
      },
      ItemId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.dropTable('Colors')
  }
}
