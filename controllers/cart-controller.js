const cartServices = require('../services/cart-services')
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
}
module.exports = cartController