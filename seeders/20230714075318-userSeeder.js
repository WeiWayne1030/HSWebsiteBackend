'use strict'

const bcrypt = require('bcrypt-nodejs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
const users = [
      {
        email: 'seller001@example.com',
        account: 'seller001',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
        name: 'seller001',
        avatar: 'https://loremflickr.com/320/240/people',
        sex: 'male',
        telNumber: '0911111111',
        role: 'seller',
        introduction: '我是賣家001',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'buyer001@example.com',
        account: 'buyer001',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
        name: 'buyer001',
        avatar: 'https://loremflickr.com/320/240/people',
        sex: 'female',
        telNumber: '0922222222',
        role: 'buyer',
        introduction: '我是買家001',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'buyer002@example.com',
        account: 'buyer002',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
        name: 'buyer002',
        avatar: 'https://loremflickr.com/320/240/people',
        sex: 'male',
        telNumber: '0933333333',
        role: 'buyer',
        introduction: '我是買家002',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
     await queryInterface.bulkInsert('Users', users)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  },
}
