'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories',
      ['紅色', '橙色', '黃色', '墨綠色', '藍色', '紫色', '粉色','灰色','白色','黑色','棕色']
        .map(item => {
          return {
            name: item,
            created_at: new Date(),
            updated_at: new Date()
          }
        }
        ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Colors', {})
  }
}
