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
  //           attribute:[name, amount, image],
  //             include: [{
  //               model:Category,
  //               attribute:[name]
  //             }]
  //         },
  //         {
  //           model:Color,
  //           attribute:[name]
  //         },
  //         {
  //           model:Size,
  //           attribute:[name]
  //         }],
  //         attribute: [{}]
  //       })
        
  //       const newCart = await cart.create({
  //           quantity,
            
  //       })
  //       return cb(null, {
  //           status: 'success',
  //           message: '推文成功！',
  //           ...tweet.dataValues,
  //           createdAt: relativeTimeFromNow(tweet.dataValues.createdAt)
  //       })
  //     } catch (err) {
  //         cb(err)
  //     }
  //   },
}
module.exports = cartController