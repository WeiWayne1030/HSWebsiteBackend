const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Get all items and stocks
      const items = await queryInterface.sequelize.query('SELECT id, price FROM Items;', {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      });

      const stocks = await queryInterface.sequelize.query('SELECT id, itemStock, ItemId FROM Stocks;', {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      });

      const fakeCarts = [];

      for (const stock of stocks) {
        const item = items.find((item) => item.id === stock.ItemId);
        if (!item) {
          continue;
        }

        const itemQuantity = faker.datatype.number({ min: 1, max: stock.itemStock });
        const amount = item.price * itemQuantity;
        const orderId = faker.datatype.number({ min: 1, max: 100 });
        const userId = faker.datatype.number({ min: 1, max: 1000 }); // Generating a random UserId between 1 and 1000

        fakeCarts.push({
          stockId: stock.id,
          UserId: userId,
          itemQuantity,
          amount,
          OrderId: orderId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      await queryInterface.bulkInsert('Carts', fakeCarts, {});
    } catch (error) {
      console.error('Error generating fake Carts:', error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Carts', null, {});
  },
};
