const cartServices = require('../services/cart-services')

const cartController = {
  getCarts: (req, res, next) => {
      cartServices.getCarts(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
   addToCart: (req, res, next) => {
      cartServices.addToCart(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  delCart: (req, res, next) => {
      cartServices.delCart(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  delCarts: (req, res, next) => {
      cartServices.delCarts(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  
}
module.exports = cartController