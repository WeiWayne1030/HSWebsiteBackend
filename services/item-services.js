const { Item, Category, Color } = require('../models')

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
        
        const item = await Item.findByPk(id, {
            include: [
                {
                    model: Category,
                    attributes: ['name'],
                }
            ],
            order: [['createdAt', 'DESC']],
        });

        if (!item) {
            throw new Error("商品不存在！");
        }

        const simplifiedItem = {
            id: item.id,
            name: item.name,
            image: item.image,
            description: item.description,
            category: item.Category.name,
        };

        return cb(null, simplifiedItem);
    } catch (err) {
        return cb(err);
    }
  }
}


module.exports = itemServices