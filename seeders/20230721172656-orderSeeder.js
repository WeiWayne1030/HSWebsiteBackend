const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {

      const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role <> 'seller'",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
      )

      const carts = await queryInterface.sequelize.query('SELECT * FROM Carts;', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })

      const methods = await queryInterface.sequelize.query('SELECT id FROM Methods;', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })

      const userIds = users.map((user) => user.id)
      // Get distinct UserIds from the Orders table
      const distinctUserIds = Array.from(new Set(carts.map(cart => cart.UserId)))


      const orders = []
      for (let i = 0; i < distinctUserIds.length; i++) {
        const UserId = distinctUserIds[i]
        const randomMethodId = methods[Math.floor(Math.random() * methods.length)].id

        function generateOrderNumber(orderIndex) {
          const orderNumberInt = 100001 + orderIndex
          return `OR${orderNumberInt.toString().padStart(6, '0')}`
        }

        const orderNumber = generateOrderNumber(i)
        //購物車總數量
        const userCarts = carts.filter(cart => cart.UserId === UserId)
        const itemCount = userCarts.length
        //購物車總金額
        const total = userCarts.reduce((sum, cart) => sum + cart.amount, 0)

        orders.push({
          orderNumber: orderNumber,
          state: 0,
          shipName: faker.name.findName(),
          UserId: UserId,
          shipTel: faker.phone.phoneNumber(),
          MethodId: randomMethodId, // Using a random MethodId from the Methods table
          itemCount: itemCount,
          total: total,
          address: faker.address.streetAddress(),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }

      // Check if orders has any data to insert
      if (orders.length > 0) {
        // Insert the generated orders into the Orders table
        const insertedOrders = await queryInterface.bulkInsert('Orders', orders, {})
      }
    } catch (error) {
      console.error('Error while seeding Orders:', error)
    }
  },

  down: async (queryInterface) => {
    // Truncate (delete all) records from the Orders table
    await queryInterface.bulkDelete('Orders', null, {})
  },
}