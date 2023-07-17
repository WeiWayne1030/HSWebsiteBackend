'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Colors',
      ['紅色', '橙色', '黃色', '墨綠色', '藍色', '紫色', '粉色','灰色','白色','黑色','棕色']
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
    await queryInterface.bulkDelete('Colors', {})
  }
}
