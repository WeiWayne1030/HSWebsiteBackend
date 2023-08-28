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
    if (!id) {
      throw new Error("商品不存在！");
    }
    
    const item = await Item.findOne({
      where: { id },
      include: [
        {
          model: Category,
          attributes: ['name'],
        },
        {
          model: Color,
          attributes: ['id','name','itemStock'],
          include:[
            {
              model: Size,
              attributes: ['name'],
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
    });
    
    if (!item) {
      return cb(null, {});
    }
    
    if (!item.state) { // Assuming "state" is a property of the item
      throw new Error("商品已下架！");
    }

    const mergedStocks = {};
    item.Colors.forEach(color => {
      const colorName = color.name;
      if (!mergedStocks[colorName]) {
        mergedStocks[colorName] = {
          color: color.name,
          sizes: [],
        };
      }
      mergedStocks[colorName].sizes.push(color.Size);
    });

    // Convert mergedStocks object into an array
    const mergedStocksArray = Object.values(mergedStocks);

    const data = { item, mergedStocks: mergedStocksArray };


    return cb(null, data);
  } catch (err) {
    return cb(err);
  }
}
}


module.exports = itemServices