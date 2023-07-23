'use strict';

const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Assuming you have a 'Methods' table with IDs starting from 1
      const methods = await queryInterface.sequelize.query('SELECT id FROM Methods;', {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      });

      const orders = await queryInterface.sequelize.query('SELECT id, UserId FROM Orders;', {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      });

      // Generate fake OrderInfos based on the number of Order records
      const fakeOrderInfos = [];

      for (const order of orders) {
        const methodId = Math.floor(Math.random() * methods.length) + 1;

        fakeOrderInfos.push({
          MethodId: methodId,
          UserId: order.UserId, // Use the UserId from the corresponding Order record
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
