'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories',
      ['Brotop', '上衣', '下身', '洋裝', '套裝 & 連身褲', '外套 & 罩衫', '配件','鞋子']
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
    await queryInterface.bulkDelete('Categories', {})
  }
}
