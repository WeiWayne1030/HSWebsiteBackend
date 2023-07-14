'use strict';
const bcrypt = require('bcrypt-nodejs')

module.exports = {
  up: async(queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Users', [{
            email: 'seller001@example.com',
            account: 'seller001',
            password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
            name: 'seller001',
            avatar: `https: //loremflickr.com/320/240/people`,
            sex:'male',
            telNumber:'0911111111',
            born: 2000/11/23,
            role: 'admin',
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
            born: 2000/11/22,
            role: 'user',
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
            born: 2000/11/11,
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date()
        }])
    },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Todos', null, {})
      .then(() => queryInterface.bulkDelete('Users', null, {}))
  }
};
