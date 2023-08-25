'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sizes = await queryInterface.sequelize.query(
      'SELECT * FROM Sizes',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const colorsData = [];
    const colorNames = ['紅色', '橙色', '黃色', '墨綠色', '藍色', '紫色', '粉色', '灰色', '白色', '黑色', '棕色'];

    for (let i = 0; i < 30; i++) {
      const colorName = colorNames[Math.floor(Math.random() * colorNames.length)];
      const availableSizes = sizes.filter(size => !colorsData.some(item => item.name === colorName && item.SizeId === size.id));
      
      if (availableSizes.length === 0) {
        // If all sizes for this color are used, move to the next color
        continue;
      }
      
      const selectedSize = availableSizes[Math.floor(Math.random() * availableSizes.length)];

      colorsData.push({
        name: colorName,
        itemStock: Math.floor(Math.random() * 10),
        SizeId: selectedSize.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('Colors', colorsData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Colors', null, {});
  }
};





