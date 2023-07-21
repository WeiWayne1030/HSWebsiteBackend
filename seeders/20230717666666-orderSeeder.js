const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Fetch the data from the Carts table
      const carts = await queryInterface.sequelize.query('SELECT id, UserId, amount FROM Carts', {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      });

      // Group the data by UserId in Carts
      const cartsByUserId = carts.reduce((acc, cart) => {
        acc[cart.UserId] = acc[cart.UserId] || [];
        acc[cart.UserId].push(cart);
        return acc;
      }, {});

      const ordersData = [];

      // Generate random CartId and calculate total for each UserId
      Object.keys(cartsByUserId).forEach((userId) => {
        const randomCartIndex = Math.floor(Math.random() * cartsByUserId[userId].length);
        const randomCart = cartsByUserId[userId][randomCartIndex];
        const randomCartId = randomCart.id;
        const total = cartsByUserId[userId].reduce((sum, cart) => sum + cart.amount, 0);

        ordersData.push({
          total: total,
          state: faker.random.boolean(),
          CartId: randomCartId,
          UserId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      // Insert the data into the Orders table
      await queryInterface.bulkInsert('Orders', ordersData, {});
    } catch (error) {
      console.error('Error seeding data:', error);
    }
  },

  down: async (queryInterface) => {
    // Truncate (delete all) records from the Orders table
    await queryInterface.bulkDelete('Orders', null, {});
  },
};
