const { Item, Stock, Color, Size, Cart, Category } = require('../models')
const helpers = require('../_helpers');
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const cartServices = {
  getCarts: async(req, cb) => {
    try {
      const DEFAULT_LIMIT = 9
      const categoryId = Number(req.query.categoryId) || ''
      const sizeId = Number(req.query.sizeId) || ''
      const colorId = Number(req.query.colorId) || ''
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)
      const userId = helpers.getUser(req).id
      const carts = await Cart.findAndCountAll({
        where: { UserId: userId },
        include: [
          {
            model: Stock,
            include: [
              {
                model: Item,
                include: [
                  {
                    model: Category,
                    where: { ...categoryId ? { categoryId } : {} }
                  }
                ]
              },
              {
                model: Color,
                where: { ...colorId ? { colorId } : {} }
              },
              {
                model: Size,
                where: { ...sizeId ? { sizeId } : {} }
              }
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });
      const categories = await Category.findAll({ raw: true });
      const sizes = await Size.findAll({ raw: true });
      const colors = await Color.findAll({ raw: true });
      if (!carts === 0) {
        throw new Error('目前沒有任何物品在購物車裡！');
      }
      const pagination = getPagination(limit, page, carts.count);
      cb(null, carts, categories, sizes, colors, categoryId, sizeId, colorId, pagination);
    } catch (err) {
      cb(err);
    }
  },
  addToCart: async (req, cb) => {
    try {
      const id = Number(req.body.ColorId);
      
      const itemQuantity = Number(req.body.itemQuantity); 
      
      const existingCartItem = await Cart.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          ColorId: id
        }
      });

      if (existingCartItem) {
        throw new Error('你已經加入購物車了');
      }
      
      const stock = await Color.findOne({
        where: {id: id},
        include: [{
          model: Item,
          attributes: ['price']
        }
      ]
      });

      if (stock.itemStock === 0) {
        throw new Error("此商品已沒庫存");
      }

      if (stock.itemStock < itemQuantity) {
        throw new Error("無效數量");
      }
      
      const price = stock.Item.price;
      const amount = price * itemQuantity;

      stock.itemStock -= itemQuantity;
      await stock.save()

      await Cart.create({
        itemQuantity,
        UserId: helpers.getUser(req).id,
        ColorId: id,
        amount
      });

      cb(null, {
        status: '已添加購物車！'
      });
    } catch (err) {
      cb(err);
    }
  },
  delCart: async (req, cb) => {
    try {
      const id = req.params.id;
      const cart = await Cart.findByPk(id);
      if (!cart) throw new Error('購物車裡沒有該品項!');
      await Cart.destroy({
        where: {
          id: id
        }
      });
      cb(null, {
        status: '已將該品項在購物車中移除！'
      });
    } catch (err) {
      cb(err);
    }
  },
  delCarts: async (req, cb) => {
      try {
          const userId = helpers.getUser(req).id;
          const carts = await Cart.findAll({
              where: { UserId: userId },
          });

          if (carts.length === 0) {
              throw new Error('目前沒有任何訂單！');
          }

          await Cart.destroy({
              where: { UserId: userId },
          });

          cb(null, {
        status: '已刪除全部品項！'
      })
      } catch (err) {
          cb(err);
      }
  },
  
}


module.exports = cartServices