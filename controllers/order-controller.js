const orderServices = require('../services/order-services')

const orderController = {
  getOrders: (req, res, next) => {
      orderServices.getOrders(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
};

module.exports = orderController;