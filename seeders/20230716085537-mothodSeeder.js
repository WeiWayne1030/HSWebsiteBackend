'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Methods',
      ['貨到付款', '信用卡付款','轉帳付款']
        .map(item => {
          return {
            name: item,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
        ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Methods', {})
  }
}

