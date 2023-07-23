const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const orders = await queryInterface.sequelize.query('SELECT orderNumber, total, orderInfoId, UserId FROM Orders;', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      });

      // Get distinct UserIds from the Orders table
      const distinctUserIds = Array.from(new Set(orders.map(order => order.UserId)));

      const methods = await queryInterface.sequelize.query('SELECT id FROM Methods;', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      });

      const orderInfos = [];
      for (const UserId of distinctUserIds) {
        const randomMethodId = methods[Math.floor(Math.random() * methods.length)].id;

        orderInfos.push({
          orderNumber: orders.find(order => order.UserId === UserId).orderNumber,
          shipName: faker.name.findName(),
          UserId: UserId,
          shipTel: faker.phone.phoneNumber(),
          MethodId: randomMethodId, // Using a random MethodId from the Methods table
          total: orders.find(order => order.UserId === UserId).total,
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // Check if orderInfos has any data to insert
      if (orderInfos.length > 0) {
        // Insert the generated orderInfos into the OrderInfos table
        const insertedOrderInfos = await queryInterface.bulkInsert('OrderInfos', orderInfos, {});

        // Now, update the orderInfoId for each orderInfo to match the corresponding UserId from the Orders table
        for (let i = 0; i < insertedOrderInfos.length; i++) {
          const orderInfoId = insertedOrderInfos[i];
          const orderIdToUpdate = orders.find(order => order.UserId === orderInfos[i].UserId);
          await queryInterface.sequelize.query(
            `UPDATE OrderInfos SET orderInfoId = ${orderIdToUpdate.orderInfoId} WHERE id = ${orderInfoId};`
          );
        }
      }
    } catch (error) {
      console.error('Error while seeding OrderInfos:', error);
    }
  },

  down: async (queryInterface) => {
    // Truncate (delete all) records from the OrderInfos table
    await queryInterface.bulkDelete('OrderInfos', null, {});
  },
};