'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role <> 'seller'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const stocks = await queryInterface.sequelize.query(
      "SELECT id, itemStock FROM Colors WHERE itemStock > 0",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const itemsAndPrices = await queryInterface.sequelize.query(
      "SELECT id, price FROM Items WHERE state <> 'false'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const cartItems = []
    const addedItems = new Set() // Keep track of added items (UserId + ColorId)

    for (let i = 0; i < 10; i++) { 
      const randomUserIndex = Math.floor(Math.random() * users.length)
      const randomSizeIndex = Math.floor(Math.random() * stocks.length)
      const randomItemIndex = Math.floor(Math.random() * itemsAndPrices.length)
      
      const user = users[randomUserIndex]
      const colorAndStock = stocks[randomSizeIndex]
      const itemAndPrice = itemsAndPrices[randomItemIndex]

      const maxItemQuantity = Math.min(Number(colorAndStock.itemStock))
      const itemQuantity = faker.random.number({ min: 1, max: maxItemQuantity })

      // 修正 generateOrderNumber 函式
      function generateOrderNumber(userId) {
        const orderNumberInt = 100001 + users.indexOf(user)
        return `OR${orderNumberInt.toString().padStart(6, '0')}`
      }
      const orderNumber = generateOrderNumber(user.id)

      const cartItemId = `${user.id}-${colorAndStock.id}`
      if (!addedItems.has(cartItemId) && itemQuantity > 0) {
        addedItems.add(cartItemId)

        const amount = itemQuantity * itemAndPrice.price

        cartItems.push({
          orderNumber: orderNumber,
          UserId: user.id,
          state: '已生成訂單',
          ColorId: colorAndStock.id,
          itemQuantity: itemQuantity,
          amount: amount,
          createdAt: new Date(),
          updatedAt: new Date()
        })

        // 更新 itemStock
        await queryInterface.sequelize.query(
          `UPDATE Colors SET itemStock = itemStock - :itemQuantity WHERE id = :colorId`,
          {
            replacements: { itemQuantity: itemQuantity, colorId: colorAndStock.id },
            type: queryInterface.sequelize.QueryTypes.UPDATE
          }
        )
      }
    }

    await queryInterface.bulkInsert('Carts', cartItems, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Carts', null, {})
  }
}





