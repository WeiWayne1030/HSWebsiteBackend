'use strict'

module.exports = {
  up: async(queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role <> 'seller'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const items = await queryInterface.sequelize.query('SELECT id FROM Items;', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })
    
    const existingPairs = new Set() // 用來儲存已存在的 UserId-ItemId 對

    const fakeOrders = Array.from({ length: 30 }, () => {
      const userId = users[Math.floor(Math.random() * users.length)].id
      const itemId = items[Math.floor(Math.random() * items.length)].id

      const pair = `${userId}-${itemId}` // 建立 UserId-ItemId 對

      // 檢查是否已存在相同的 UserId-ItemId 對，若存在則重新選取
      if (existingPairs.has(pair)) {
        return null
      }

      existingPairs.add(pair) // 將新的 UserId-ItemId 對加入已存在的集合

      return {
        UserId: userId,
        ItemId: itemId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }).filter(order => order !== null) 

    await queryInterface.bulkInsert('Orders', fakeOrders)
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Orders', {})
  }
}
