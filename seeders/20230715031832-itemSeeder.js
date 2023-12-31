'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const items = [
      {
        name: '甜心極美背後扭結螺紋彈力Bratop',
        state: true,
        price: 150,
        CategoryId: 4,
        image: 'https://imgur.com/4q0jgMB.jpg',
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '透膚多穿天絲薄款短襯衫(罩衫)',
        state: true,
        price: 250,
        CategoryId: 4,
        image: 'https://imgur.com/HhnKscI.jpg',
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '天絲背鏤空設計襯衫搭配斜肩條紋吊帶小背心兩件式套裝',
        state: false,
        price: 500,
        CategoryId: 54,
        image: 'https://imgur.com/IfxgyFI.jpg',
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: '不悶熱涼感滑雪紡抽繩垂墜工裝褲(工裝長褲)',
        state: true,
        price: 350,
        CategoryId: 34,
        image: 'https://imgur.com/QvIm1lW.jpg',
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    await queryInterface.bulkInsert('Items', items)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Items', null, {})
  },
}
