'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const colors = await queryInterface.sequelize.query(
      'SELECT id FROM Colors',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const sizes = await queryInterface.sequelize.query('SELECT id FROM Sizes;', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })
    const items = await queryInterface.sequelize.query('SELECT id FROM Items;', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })

    const existingPairs = new Set() // 用來儲存已存在的 UserId-ItemId pair
    const fakeStock = []
    let counter = 1

    for (let i = 0; i < items.length; i++) {
      const itemId = items[i].id
      const sizeIds = new Set()
      const colorIds = new Set()

      while (sizeIds.size < 6) {
        const sizeId = sizes[Math.floor(Math.random() * sizes.length)].id
        sizeIds.add(sizeId)
      }

      while (colorIds.size < 11) {
        const colorId = colors[Math.floor(Math.random() * colors.length)].id
        colorIds.add(colorId)
      }

      for (const sizeId of sizeIds) {
        for (const colorId of colorIds) {
          const pair = `${itemId}-${sizeId}-${colorId}` // 建立 ItemId-SizeId-ColorId pair
          // 檢查是否已存在相同的 ItemId-SizeId-ColorId pair，若存在則重新選取
          if (existingPairs.has(pair)) {
            continue
          }

          existingPairs.add(pair) // 將新的 ItemId-SizeId-ColorId pair 加入已存在的集合

          const itemstock = Math.floor(Math.random() * 10) + 1
          const paddedCounter = counter.toString().padStart(2, '0')
          fakeStock.push({
            productNumber: `ST1000${paddedCounter}`,
            itemstock,
            ColorId: colorId,
            SizeId: sizeId,
            ItemId: itemId,
            createdAt: new Date(),
            updatedAt: new Date()
          })
          counter++
        }
      }
    }

    await queryInterface.bulkInsert('Stock', fakeStock, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Stock', null, {})
  }
}
