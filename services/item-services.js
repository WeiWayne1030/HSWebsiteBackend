const { Item, Category, Stock, Color, Size } = require('../models')
<<<<<<< HEAD
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const itemServices = {
  getItems: async (req, cb) => {
    try {
      const DEFAULT_LIMIT = 9
      const CategoryId = Number(req.query.CategoryId) || ''
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)
      console.log(offset)
      let items = await Item.findAndCountAll({
        where: { state: true }, 
        attributes: ['name', 'image', 'price'],
        include: [
          {
            model: Category,
            where: {  // 新增查詢條件
            ...CategoryId ? { CategoryId } : {} // 檢查 categoryId 是否為空值
          },
            attributes: ['name'],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });
      let categories = await Category.findAll({ raw: true })
      if (!items || items.length === 0) {
        throw new Error("目前沒有任何商品！");
      }
      const pagination = getPagination(limit, page, items.count)
      return cb(null, items, categories, CategoryId, pagination);
    } catch (err) {
      return cb(err);
    }
  },
  getItem: async (req, cb) => {
    try {
      const { id } = req.params;
      if (!id ) {
=======

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
>>>>>>> 78ba64403d9cd869e89b70947594f13e8f3a6409
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
<<<<<<< HEAD
      if (!items.state === false) {
        throw new Error("商品已下架！");
      }
=======
>>>>>>> 78ba64403d9cd869e89b70947594f13e8f3a6409
      if (items.length === 0) {
      return cb(null, {});
    }
      const item = items[0]
      return cb(null, item);
    } catch (err) {
        return cb(err);
    }
<<<<<<< HEAD
  }, 
=======
  },
>>>>>>> 78ba64403d9cd869e89b70947594f13e8f3a6409
}


module.exports = itemServices