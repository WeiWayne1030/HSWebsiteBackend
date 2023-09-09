'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Methods',
      ['貨到付款', 'LinePay付款','轉帳付款']
        .map(item => {
          return {
            name: item,
            state: true,
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

