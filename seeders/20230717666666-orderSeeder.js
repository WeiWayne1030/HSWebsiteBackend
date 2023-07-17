'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role <> 'seller'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const stock = await queryInterface.sequelize.query('SELECT id, ItemId FROM Stock;', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    });

    const items = await queryInterface.sequelize.query('SELECT id, amount FROM Items;', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    });

    const existingPairs = new Set(); // 用来储存已存在的 UserId-ItemId 对
    let counter = 1;

    const fakeOrders = Array.from({ length: 30 }, () => {
      const user = users[Math.floor(Math.random() * users.length)];
      const stockItem = stock[Math.floor(Math.random() * stock.length)];
      const item = items.find((item) => item.id === stockItem.ItemId);
      const itemQuantity = Math.floor(Math.random() * 10);
      const total = item ? item.amount * itemQuantity : 0;
      const pair = `${user.id}-${stockItem.id}`; // 建立 UserId-ItemId 对
      const state = Math.random() >= 0.5;
      const paddedCounter = counter.toString().padStart(2, '0');

      // 检查是否已存在相同的 UserId-ItemId 对，若存在则重新选择
      if (existingPairs.has(pair)) {
        return null;
      }

      existingPairs.add(pair); // 将新的 UserId-ItemId 对加入已存在的集合

      return {
        orderNumber: `OR1000${paddedCounter}`,
        state,
        UserId: user.id,
        StockId: stockItem.id,
        productQuantity: itemQuantity,
        total,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }).filter((order) => order !== null);

    await queryInterface.bulkInsert('Orders', fakeOrders);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Orders', {});
  }
};
