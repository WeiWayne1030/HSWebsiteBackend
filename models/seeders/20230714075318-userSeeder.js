'use strict'

const bcrypt = require('bcrypt-nodejs')

module.exports = {
<<<<<<< HEAD:seeders/20230714075318-userSeeder.js
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
=======
  up: async(queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Users', [{
            email: 'seller001@example.com',
            account: 'seller001',
            password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
            name: 'seller001',
            avatar: `https: //loremflickr.com/320/240/people`,
            sex:'male',
            telNumber:'0911111111',
            role: 'seller',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            email: 'buyer001@example.com',
            account: 'buyer001',
            password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
            name: 'buyer001',
            avatar: `https: //loremflickr.com/320/240/people`,
            sex:'female',
            telNumber:'0922222222',
            role: 'buyer',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            email: 'buyer002@example.com',
            account: 'buyer002',
            password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
            name: 'buyer002',
            avatar: `https: //loremflickr.com/320/240/people`,
            sex:'male',
            telNumber:'0933333333',
            role: 'buyer',
            createdAt: new Date(),
            updatedAt: new Date()
        }])
    },
>>>>>>> 78ba64403d9cd869e89b70947594f13e8f3a6409:models/seeders/20230714075318-userSeeder.js

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
<<<<<<< HEAD:seeders/20230714075318-userSeeder.js
  },
=======
  }
>>>>>>> 78ba64403d9cd869e89b70947594f13e8f3a6409:models/seeders/20230714075318-userSeeder.js
}
