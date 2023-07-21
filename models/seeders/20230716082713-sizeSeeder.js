'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Sizes',
      ['SS', 'S', 'M', 'L', 'XL', 'XXL']
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
    await queryInterface.bulkDelete('Sizes', {})
  }
}
