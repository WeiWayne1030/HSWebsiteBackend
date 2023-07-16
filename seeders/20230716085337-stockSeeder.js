'use strict'

module.exports = {
  up: async(queryInterface, Sequelize) => {
    const colors = await queryInterface.sequelize.query(
      "SELECT id FROM Colors",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const sizes = await queryInterface.sequelize.query('SELECT id FROM Sizes;', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })
    

    const existingPairs = new Set() // 用來儲存已存在的 UserId-ItemId pair

    const fakeStock = Array.from({ length: 20 }, () => {
      const quantity = Math.floor(Math.random() * 10) + 1
      const colorId = colors[Math.floor(Math.random() * colors.length)].id
      const sizeId = sizes[Math.floor(Math.random() * sizes.length)].id

      const pair = `${colorId}-${sizeId}` // 建立 UserId-ItemId pair

      // 檢查是否已存在相同的 UserId-ItemId pair，若存在則重新選取
      if (existingPairs.has(pair)) {
        return null
      }

      existingPairs.add(pair) // 將新的 UserId-ItemId pair加入已存在的集合

      return {
        quantity,
        ColorId: colorId,
        SizeId: sizeId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }).filter(order => order !== null) 

    await queryInterface.bulkInsert('Stock', fakeStock)
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Stock', {})
  }
}
