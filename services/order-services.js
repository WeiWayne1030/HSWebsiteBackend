const { Item, Category, Stock, Color, Size } = require('../models')

const orderServices = {
//   getItems: async (req, cb) => {
//   try {
//     let orders = await Orders.findAll({
//       include: [
//         {
//           model: Stock,
//           attributes: [{}],
//           include:[{
//             model:Color,
//             attributes:['name']
//           },
//           {
//             model:Size,
//             attributes:['name']
//           }]
//         },
//         {
//           model:User,
          
//         }
//       ],
//       order: [['createdAt', 'DESC']],
//     });

//     if (!items || items.length === 0) {
//       throw new Error("目前沒有任何商品！");
//     }
//     return cb(null, items);
//   } catch (err) {
//     return cb(err);
//   }
// },
}


module.exports = orderServices