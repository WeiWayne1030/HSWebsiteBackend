'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Sizes',
      ['SS', 'S', 'M', 'L', 'XL', 'XXL']
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
    await queryInterface.bulkDelete('Sizes', {})
  }
}
