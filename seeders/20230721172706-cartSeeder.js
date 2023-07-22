const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Helper function to generate a random integer between min and max (inclusive)
      function getRandomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      // Get all items and stocks
      const items = await queryInterface.sequelize.query("SELECT id, price FROM Items WHERE state <> 'false'", {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      });

      const stocks = await queryInterface.sequelize.query("SELECT id, itemStock, ItemId FROM Stocks", {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      });

      const users = await queryInterface.sequelize.query(
        "SELECT id FROM Users WHERE role <> 'seller'",
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      const fakeCarts = [];

      function cartExists(userId, stockId, usedStockIds) {
        return fakeCarts.some((cart) => cart.UserId === userId && cart.StockId === stockId) ||
          usedStockIds[userId]?.has(stockId);
      }

      for (let i = 0; i < 10; i++) {
        let randomItem, randomStock, itemQuantity, amount, randomUser;

        const usedStockIds = {};

        do {
          // Randomly select a user
          randomUser = faker.random.arrayElement(users);

          // If there are no stocks available for the user, skip generating the cart for this user
          const userStocks = stocks.filter((stock) => stock.ItemId !== 'false' && !cartExists(randomUser.id, stock.id, usedStockIds));
          if (userStocks.length === 0) {
            console.log('No more valid stocks for user:', randomUser);
            break;
          }

          // Randomly select an item and stock
          randomItem = faker.random.arrayElement(items);
          randomStock = userStocks.find((stock) => stock.ItemId === randomItem.id);
        } while (!randomStock); // Keep re-selecting until a valid stock is found

        if (!randomStock) {
          console.log('No stock found for user:', randomUser);
          continue;
        }

        // Generate a random quantity for the cart (between 1 and itemStock)
        itemQuantity = getRandomInteger(1, randomStock.itemStock);

        // Calculate the amount (price * itemQuantity)
        amount = randomItem.price * itemQuantity;

        // Store the used StockId for the selected user
        if (!usedStockIds[randomUser.id]) {
          usedStockIds[randomUser.id] = new Set();
        }
        usedStockIds[randomUser.id].add(randomStock.id);

        fakeCarts.push({
          StockId: randomStock.id, // Assuming the column name is 'StockId' in the Carts table
          UserId: randomUser.id,
          itemQuantity: itemQuantity,
          amount: amount,
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