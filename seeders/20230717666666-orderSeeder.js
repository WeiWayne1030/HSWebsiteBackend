const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Fetch the data from the Carts table, sorted by UserId in ascending order
      const carts = await queryInterface.sequelize.query(
        'SELECT id, UserId, amount FROM Carts ORDER BY UserId ASC',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
        }
      );

      const users = await queryInterface.sequelize.query(
        "SELECT id FROM Users WHERE role <> 'seller' ORDER BY id ASC",
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      const ordersData = [];
      const userCartTotals = {}; // To store the total amount for each UserId
      const userIds = users.map((user) => user.id);

      // Calculate the total amount for each UserId
      carts.forEach((cart) => {
        if (!userCartTotals[cart.UserId]) {
          userCartTotals[cart.UserId] = 0;
        }
        userCartTotals[cart.UserId] += cart.amount;
      });

      // Function to generate random OrderInfoId based on the number of Users
      function getRandomOrderInfoId(userId) {
        // Get the index of the current userId in the sorted userIds array
        const userIdIndex = userIds.indexOf(userId);
        // Add 1 to the index to get the corresponding OrderInfoId (as it starts from 1)
        return userIdIndex !== -1 ? userIdIndex + 1 : null;
      }

      // Function to generate the order number based on UserId
      function generateOrderNumber(userId) {
        const orderNumberInt = 100001 + userIds.indexOf(userId);
        return `OR${orderNumberInt.toString().padStart(6, '0')}`;
      }

      // Generate ordersData array based on the calculated values
      for (const cart of carts) {
        const randomOrderInfoId = getRandomOrderInfoId(cart.UserId);

        const itemQuantity = carts.filter((c) => c.UserId === cart.UserId).length;

        const orderNumber = generateOrderNumber(cart.UserId);

        ordersData.push({
          orderNumber: orderNumber,
          total: userCartTotals[cart.UserId], // Total amount for the user's carts
          state: 0,
          CartId: cart.id,
          OrderInfoId: randomOrderInfoId,
          itemQuantity: itemQuantity,
          UserId: cart.UserId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

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
