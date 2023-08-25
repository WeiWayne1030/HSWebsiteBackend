'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const colors = await queryInterface.sequelize.query(
      'SELECT id FROM Colors',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const items = await queryInterface.sequelize.query(
      "SELECT id FROM Items WHERE state <> 'true'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const fakeStock = [];
    let productNumberCounter = 1;

    for (const itemId of items.map(item => item.id)) {
      const itemColors = [...colors]; // Create a copy of colors array for each item
      const itemColorIds = new Set(); // To keep track of used ColorIds for the item

      while (itemColors.length > 0) {
        const productNumber = `ST${productNumberCounter.toString().padStart(10, '0')}`;
        productNumberCounter++;

        const randomColorIndex = Math.floor(Math.random() * itemColors.length);
        const randomColor = itemColors[randomColorIndex];

        if (!itemColorIds.has(randomColor.id)) {
          itemColorIds.add(randomColor.id);
          itemColors.splice(randomColorIndex, 1);

          fakeStock.push({
            productNumber,
            ColorId: randomColor.id,
            ItemId: itemId,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }

        if (fakeStock.length >= 20) {
          break;
        }
      }
    }

    await queryInterface.bulkInsert('Stocks', fakeStock, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Stocks', null, {});
  }
};
