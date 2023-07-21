const cartServices = require('../services/cart-services')
<<<<<<< HEAD

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
  
=======
const { Item, Category, Stock, Color, Size, Cart } = require('../models')

const cartController = {
  // addToCart: async(req, res) => {
  //   try {
  //       const { id } = req.params
  //       const { quantity } = req.body
  //       if (!id) throw new Error('此商品不存在！')
  //       const cart = await Cart.findOne({
  //         where: {
  //                   StockId: id
  //               },
  //         include: [{
  //           model:Item,
  //           attributes:[name, amount, image],
  //             include: [{
  //               model:Category,
  //               attribute:[name]
  //             }]
  //         },
  //         {
  //           model:Color,
  //           attributes:[name]
  //         },
  //         {
  //           model:Size,
  //           attributes:[name]
  //         }],
  //         attributes: [{}]
  //       })

  //       const amount = await Cart.findOne({
  //         where: {
  //                   StockId: id
  //               },
  //         include: [{
  //           model:Item,
  //           attributes:[amount]
  //         }]
  //       })

  //       const total = await quantity * amount
        
  //       const newCart = await cart.create({
  //           quantity,
  //           StockId:id,
  //           total
  //       })
  //       return res({
  //           status: 'success',
  //           message: '成功放入購物車！',
  //           newCart
  //       })
  //     } catch (err) {
  //         res(err)
  //     }
  //   },
>>>>>>> 78ba64403d9cd869e89b70947594f13e8f3a6409
}
module.exports = cartController