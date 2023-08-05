const { Item, Category, Stock, Color, Size } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const itemServices = {
  getItems: async (req, cb) => {
  const categoryId = Number(req.query.CategoryId) || ""; // Use "CategoryId" instead of "categoryId"

  try {
    const [items, categories] = await Promise.all([
      Item.findAll({
        where: { state: true },
        include: Category,
        where: categoryId !== "" ? { categoryId } : {},
        nest: true,
        raw: true,
      }),
      Category.findAll({ raw: true }),
    ]);

    cb(null, {
      items,
      categories,
      categoryId,
    });
  } catch (err) {
    cb(err);
  }
},
  getItem: async (req, cb) => {
    try {
      const { id } = req.params;
      if (!id ) {
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
            attributes:['itemStock'],
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
      if (!items.state === false) {
        throw new Error("商品已下架！");
      }
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