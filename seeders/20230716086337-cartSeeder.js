'use strict';

const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch users with role <> 'seller'
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role <> 'seller'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Fetch sizes and items data
    const sizesAndStocks = await queryInterface.sequelize.query(
      "SELECT id, itemStock FROM Colors",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const itemsAndPrices = await queryInterface.sequelize.query(
      "SELECT id, price FROM Items WHERE state <> 'false'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Create cart items
    const cartItems = [];
    const maxUsers = users.length;

    for (let i = 0; i < 20; i++) { // Create 100 cart items
      const randomUserIndex = Math.floor(Math.random() * maxUsers);
      const randomSizeIndex = Math.floor(Math.random() * sizesAndStocks.length);
      const randomItemIndex = Math.floor(Math.random() * itemsAndPrices.length);
      
      const user = users[randomUserIndex];
      const sizeAndStock = sizesAndStocks[randomSizeIndex];
      const itemAndPrice = itemsAndPrices[randomItemIndex];

      const maxItemQuantity = Math.min(sizeAndStock.itemStock, 10); // Assuming max quantity per cart item is 10
      const itemQuantity = faker.random.number({ min: 1, max: maxItemQuantity });
      const amount = itemQuantity * itemAndPrice.price;

      cartItems.push({
        UserId: user.id,
        StockId: sizeAndStock.id,
        itemQuantity: itemQuantity,
        amount: amount,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('Carts', cartItems, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Carts', null, {});
  }
};