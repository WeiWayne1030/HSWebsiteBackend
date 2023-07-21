'use strict';

const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Assuming you have a 'Methods' table with IDs starting from 1
      const methods = await queryInterface.sequelize.query('SELECT id FROM Methods;', {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      });

      // Assuming you have a 'Users' table with IDs starting from 1
      const users = await queryInterface.sequelize.query('SELECT id FROM Users;', {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      });

      // Assuming you have an 'OrderInfos' table with IDs starting from 1
      const orderInfos = await queryInterface.sequelize.query('SELECT id FROM OrderInfos;', {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      });

      // Generate fake OrderInfos based on the number of Order records
      const fakeOrderInfos = [];

      for (const orderInfo of orderInfos) {
        const methodId = Math.floor(Math.random() * methods.length) + 1;
        const userId = Math.floor(Math.random() * users.length) + 1;

        const orderNumber = `OR${faker.datatype.uuid()}`;

        fakeOrderInfos.push({
          orderNumber: orderNumber,
          MethodId: methodId,
          UserId: userId,
          shipName: faker.name.findName(),
          shipTel: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      await queryInterface.bulkInsert('OrderInfos', fakeOrderInfos, {});
    } catch (error) {
      console.error('Error generating fake OrderInfos:', error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Assuming you have an 'OrderInfos' table
    await queryInterface.bulkDelete('OrderInfos', null, {});
  },
};
