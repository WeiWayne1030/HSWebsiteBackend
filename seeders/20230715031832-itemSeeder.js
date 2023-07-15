'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Items', [
      {
        itemNumber: faker.random.arrayElement(['C001115', 'C001116', 'C001117', 'C001118']),
        name: '甜心極美背後扭結螺紋彈力Bratop',
        amount: 150,
        colorId: faker.random.arrayElement([9, 8, 7, 10]),
        stock: faker.random.arrayElement([10, 3, 7, 4]),
        categoryId: 1,
        image: 'https://imgur.com/4q0jgMB',
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        itemNumber: faker.random.arrayElement(['C001119', 'C001120', 'C001121', 'C001122', 'C001123']),
        name: '透膚多穿天絲薄款短襯衫(罩衫)',
        amount: 250,
        colorId: faker.random.arrayElement([7, 9, 6, 5, 8]),
        stock: faker.random.arrayElement([10, 3, 7, 4, 2]),
        categoryId: 1,
        image: 'https://imgur.com/HhnKscI',
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        itemNumber: faker.random.arrayElement(['C001124', 'C001125', 'C001126', 'C001127', 'C001128']),
        name: '天絲背鏤空設計襯衫搭配斜肩條紋吊帶小背心兩件式套裝',
        amount: 500,
        colorId: faker.random.arrayElement([9, 3, 7, 5, 4]),
        stock: faker.random.arrayElement([10, 3, 7, 4, 2]),
        categoryId: 5,
        image: 'https://imgur.com/HhnKscI',
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        itemNumber: faker.random.arrayElement(['C001129', 'C001130', 'C001131']),
        name: '不悶熱涼感滑雪紡抽繩垂墜工裝褲(工裝長褲)',
        amount: 350,
        colorId: faker.random.arrayElement([7, 11, 10]),
        stock: faker.random.arrayElement([10, 3, 7]),
        categoryId: 3,
        image: 'https://imgur.com/QvIm1lW',
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Items', null, {})
  },
}
