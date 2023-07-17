const orderServices = require('../services/cart-services')
const { Item, Category, Stock, Color, Size, Cart } = require('../models')

const orderController = {
  // getOrders: (req, res, next) => {
  //     orderServices.getOrders(req, (err, data) => err ? next(err) : res.status(200).json(data))
  // },
}
module.exports = orderController