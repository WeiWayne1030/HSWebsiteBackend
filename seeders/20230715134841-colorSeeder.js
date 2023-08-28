'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sizes = await queryInterface.sequelize.query(
      'SELECT * FROM Sizes',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const items = await queryInterface.sequelize.query(
      "SELECT id FROM Items WHERE state <> 'true'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const colorsData = [];
    const colorNames = ['紅色', '橙色', '黃色', '墨綠色', '藍色', '紫色', '粉色', '灰色', '白色', '黑色', '棕色'];

    let productNumberCounter = 1; // Initialize the counter

    for (const itemId of items.map(item => item.id)) {
      const itemColors = [...colorsData];
      const itemColorSizeIds = new Set();

      while (itemColors.length > 0) {
        const randomColorIndex = Math.floor(Math.random() * itemColors.length);
        const randomColor = itemColors[randomColorIndex];

        if (!itemColorSizeIds.has(`${randomColor.name}-${randomColor.SizeId}`)) {
          itemColorSizeIds.add(`${randomColor.name}-${randomColor.SizeId}`);
          itemColors.splice(randomColorIndex, 1);
        }
      }

      for (let i = 0; i < 30; i++) {
        const productNumber = `ST${productNumberCounter.toString().padStart(10, '0')}`;
        productNumberCounter++; // Increment the counter
        const colorName = colorNames[Math.floor(Math.random() * colorNames.length)];
        const availableSizes = sizes.filter(size => !itemColorSizeIds.has(`${colorName}-${size.id}`));

        if (availableSizes.length === 0) {
          // If all sizes for this color are used, move to the next color
          continue;
        }

        const selectedSize = availableSizes[Math.floor(Math.random() * availableSizes.length)];

        itemColorSizeIds.add(`${colorName}-${selectedSize.id}`);

        colorsData.push({
          name: colorName,
          productNumber,
          itemStock: Math.floor(Math.random() * 10),
          ItemId: itemId,
          SizeId: selectedSize.id,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    await queryInterface.bulkInsert('Colors', colorsData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Colors', null, {});
  }
};





