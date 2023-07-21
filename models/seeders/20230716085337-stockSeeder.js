'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
<<<<<<< HEAD:seeders/20230716085337-stockSeeder.js

=======
>>>>>>> 78ba64403d9cd869e89b70947594f13e8f3a6409:models/seeders/20230716085337-stockSeeder.js
    const colors = await queryInterface.sequelize.query(
      'SELECT id FROM Colors',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
<<<<<<< HEAD:seeders/20230716085337-stockSeeder.js

    const sizes = await queryInterface.sequelize.query('SELECT id FROM Sizes;', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })

    const items = await queryInterface.sequelize.query(
      "SELECT id FROM Items WHERE state <> 'true'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const existingPairs = new Set() // 用來儲存已存在的 UserId-ItemId pair
    const fakeStock = []
    let productNumberCounter = 1
=======
    const sizes = await queryInterface.sequelize.query('SELECT id FROM Sizes;', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })
    const items = await queryInterface.sequelize.query('SELECT id FROM Items;', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })

    const existingPairs = new Set() // 用來儲存已存在的 UserId-ItemId pair
    const fakeStock = []
    let counter = 1
>>>>>>> 78ba64403d9cd869e89b70947594f13e8f3a6409:models/seeders/20230716085337-stockSeeder.js

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
<<<<<<< HEAD:seeders/20230716085337-stockSeeder.js
          const productNumber = `ST${productNumberCounter.toString().padStart(10, '0')}`
          productNumberCounter++ // Increment the counter for the next productNumber
          fakeStock.push({
            productNumber,
=======
          const paddedCounter = counter.toString().padStart(2, '0')
          fakeStock.push({
            productNumber: `ST1000${paddedCounter}`,
>>>>>>> 78ba64403d9cd869e89b70947594f13e8f3a6409:models/seeders/20230716085337-stockSeeder.js
            itemstock,
            ColorId: colorId,
            SizeId: sizeId,
            ItemId: itemId,
            createdAt: new Date(),
            updatedAt: new Date()
<<<<<<< HEAD:seeders/20230716085337-stockSeeder.js
          });
=======
          })
          counter++
>>>>>>> 78ba64403d9cd869e89b70947594f13e8f3a6409:models/seeders/20230716085337-stockSeeder.js
        }
      }
    }

    await queryInterface.bulkInsert('Stocks', fakeStock, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Stocks', null, {})
  }
}
