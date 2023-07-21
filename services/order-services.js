const { Item, Category, Stock, Color, Size, Order, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const orderServices = {
  getOrders: async ({ query, params }, cb) => {
    try {
      let orders = await Order.findAll({
        include: [
          {
            model: Stock,
            include: [
              {
                model: Color,
                attributes: ['name'],
              },
              {
                model: Size,
                attributes: ['name'],
              },
              {
                model: Item,
                attributes: ['name', 'image'],
              },
            ],
          },
          {
            model: User,
            attributes: ['name', 'image'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      if (!orders === 0) {
        throw new Error('目前沒有任何訂單！');
      }

      cb(null, orders );
    } catch (err) {
      cb(err);
    }
  },
};

module.exports = orderServices