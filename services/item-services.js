const { Item, Category, Stock, Color, Size } = require('../models')

const itemServices = {
getItems: async (req, cb) => {
  try {
    let items = await Item.findAll({
      attributes: ['name', 'image', 'amount'],
      include: [
        {
          model: Category,
          attributes: ['name'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    if (!items || items.length === 0) {
      throw new Error("目前沒有任何商品！");
    }
    return cb(null, items);
  } catch (err) {
    return cb(err);
  }
},
  getItem: async (req, cb) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new Error("商品不存在！");
      }
      const items = await Item.findAll({
        where: { id },
        include: [
          {
            model: Category,
            attributes: ['name'],
          },
          {
            model: Stock,
            attributes:['quantity'],
              include:[{
                model:Color,
                attributes:['name']
              },
              {
                model:Size,
                attributes:['name']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      })
      if (items.length === 0) {
      return cb(null, {});
    }
      const item = items[0]
      return cb(null, item);
    } catch (err) {
        return cb(err);
    }
  },
}


module.exports = itemServices