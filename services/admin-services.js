const { localFileHandler } = require('../helpers/imgurFileHandler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const { Item, Stock, Color, Size, Cart, User, Order, Method, Category,OrderInfo } = require('../models');

const adminServices = {
    signIn: async(req, cb) => {
        try {
            const {
                account, password
            } = req.body
            if (!account || !password) throw new Error('請輸入帳號和密碼！')

            const user = await User.findOne({
                where: {
                    account
                }
            })
            if (!user) throw new Error('帳號不存在！')
            if (user.role === 'buyer') throw new Error('帳號不存在！')
            if (!bcrypt.compareSync(password, user.password)) throw new Error('帳密錯誤！')
            const payload = {
                id: user.id
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '30d'
            })
            const userData = user.toJSON()
            delete userData.password
            return cb(null, {
                status: 'success',
                message: '登入成功！',
                token,
                user: userData
            })
        } catch (err) {
            cb(err)
        }
    },
    getItems: async (req, cb) => {
        const categoryId = Number(req.query.CategoryId) || null; // Use "CategoryId" instead of "categoryId"
        try {
            const [items, categories] = await Promise.all([
            Item.findAll({
                include: Category,
                where: categoryId !== null ? { categoryId } : {},
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
    delItem: async (req, cb) => {
        try {
            const id = req.params.id;

            // 筛选在Stock模型中符合req.params.id的ItemId的Stock.id
            const stockIds = await Stock.findAll({
            where: { ItemId: id },
            attributes: ['id'],
            }).map(stock => stock.id);

            // 删除Stock模型中的所有ItemId
            await Stock.destroy({
            where: { ItemId: id },
            });

            // 删除Item模型中的所有记录
            await Item.destroy({
            where: { id: id },
            });

            // 删除Cart模型中与筛选出的StockId相匹配的记录
            await Cart.destroy({
            where: { StockId: stockIds },
            });

            cb(null, {
            status: '產品已刪除！',
            });
        } catch (err) {
        cb(err);
        }
    },
    removeItem: async (req, cb) => {
        try {
            const id = req.params.id;
            console.log(id);
            const item = await Item.findOne({ where: { id } });
            if (!item) { 
                throw new Error('找不到對應的商品！');
            }
            await Item.update({ state: false }, { where: { id } });
            cb(null, { status: '已刪除商品！' }); 
            const stockIds = await Stock.findAll({ where: { ItemId: id }, attributes: ['id'] }).map(stock => stock.id);
            await Stock.destroy({ where: { ItemId: id } });
            await Cart.destroy({ where: { StockId: stockIds } });
            
            cb(null, { status: '已刪除商品！' });

        } catch (err) {
            cb(err);
            console.log(err);
        }
    },
    postItem: async (req, cb) => {
        try {
            const { name, price, description, CategoryId } = req.body;
            if (!name || !price || !description || !CategoryId ) {
                throw new Error('所有欄位不得為空!');
            }
            const item = await Item.findOne({
            where: { name }
            });
            if (item) {
                throw new Error('此商品已存在！');
            }
            const { file } = req; 
            
            const filePath = await localFileHandler(file); 
            await Item.create({
                name,
                state: 1,
                price,
                description,
                image: filePath || null,
                CategoryId
            });
            cb(null, {
                status: '已新增品項！'
            });
        } catch (err) {
            cb(err);
        }
    },
    postStock: async (req, cb) => {
        try {
            const id = req.params.stockId;
            const { itemStock, ColorId, SizeId } = req.body;
            if (!itemStock || !ColorId || !SizeId) {
                throw new Error('所有欄位不得為空!');
            }
            if (!id) {
                throw new Error('此商品不存在！');
            }
            const item = await Item.findOne({
                where: { id }
            });
            if (!item) {
                throw new Error('找不到對應的商品！');
            }
            const stock = await Stock.findOne({
                where: { ItemId: id, ColorId, SizeId }
            });
            if (stock) {
                throw new Error('此商品庫存已存在！');
            }
            if (itemStock < 0) {
                throw new Error('庫存不得小於0！');
            }
            await Stock.create({
                productNumber: `ST${Date.now().toString().padStart(10, '0')}`,
                itemStock,
                ColorId,
                SizeId,
                ItemId: id
            });
            cb(null, {
                status: '已新增庫存！'
            });
        } catch (err) {
            console.error(err);
            cb(err);
        }
    },
    getAdminItems: async (req, cb) =>{
        try {
            const DEFAULT_LIMIT = 9
            const ColorId = Number(req.query.CategoryId) || ''
            const CategoryId = Number(req.query.ColorId) || ''
            const SizeId = Number(req.query.SizeId) || ''
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || DEFAULT_LIMIT
            const offset = getOffset(limit, page)
            
            const items = await Item.findAndCountAll({
                include: [
                    { model: Category,
                        where: { ...CategoryId ? { CategoryId } : {} }
                    }
                    ,{
                    model: Stock,
                    include: [
                        { model: Color,
                            where: {...ColorId ? { ColorId } : {}},
                        }, 
                        { model: Size,
                            where: {...SizeId ? { SizeId } : {}}
                        }]
                }],
                limit,
                offset
            })
            const categories = Category.findAll({ raw: true })
            const colors = Color.findAll({ raw: true })
            const sizes = Size.findAll({ raw: true })
            if (!items || items.length === 0) {
                throw new Error("目前沒有任何商品！");
            }
            const pagination = getPagination(limit, page, items.count)
            cb(null, { items, categories, colors, sizes, CategoryId, ColorId, SizeId, pagination })
        } catch (err) {
            cb(err)
        }
    },
    slGetOrderInfos: async (req, cb) =>{
        try {
            const DEFAULT_LIMIT = 9
            const MethodId = Number(req.query.MethodId) || ''
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || DEFAULT_LIMIT
            const offset = getOffset(limit, page)
            const orderInfos = await OrderInfo.findAndCountAll({
                include: [
                    {
                    model: Method,
                    where:  {  ...MethodId ? { MethodId } : {} },   
                }],
                limit,
                offset
            })
            const methods = Method.findAll({ raw: true })
            const pagination = getPagination(limit, page, orderInfos.count)
            cb(null, { orderInfos, methods, MethodId, pagination })
        } catch (err) {
            cb(err)
        }
    },
    slGetOrderInfo: async (req, cb) => {
        try {
            const id = req.params.id;
            if (!id) {
                throw new Error('此訂單不存在！');
            }
            const orderInfo = await OrderInfo.findOne({
                id,
                include: [{
                        model: Method   
            }],

                order: [['createdAt', 'DESC']] 
            });
            if (!orderInfo) {
                throw new Error('找不到對應的訂單！');
            }
            cb(null, orderInfo);
        } catch (err) {
            cb(err);
        }
    },
    putStock: async (req, cb) => {
        try {
            const id = req.params.id;
            const { name, price, description, CategoryId, itemStock, ColorId, SizeId } = req.body;
            if (!name || !price || !description || !itemStock || !ColorId || !SizeId || !CategoryId) {
                throw new Error('所有欄位不得為空!');
            }

            // Find the stock record with the provided ID
            const stock = await Stock.findOne({
                where: { id: id },
                include: [{
                    model: Item
                }]
            });

            // Check if a valid stock record is found
            if (!stock) {
                throw new Error('找不到該庫存記錄!');
            }

            // Find the associated item
            const item = stock.Item;

            const { file } = req;
            const filePath = await localFileHandler(file);

            // Update the item details
            await item.update({
                name,
                price,
                description,
                image: filePath || null,
                CategoryId
            });

            // Update the stock details
            await stock.update({
                itemStock,
                ColorId,
                SizeId
            });

            cb(null, {
                status: '已更新庫存！'
            });
        } catch (err) {
            cb(err);
        }
    },
    postCategory: async (req, cb) => {
        try {
            const { name } = req.body;
            if (!name) throw new Error('所有欄位不得為空!');
            await Category.create({
                name
            });
            const category = await Category.findOne({
                where: { name }
             });

            if (category) {
                throw new Error('此種類已存在！');
            }
            cb(null, {
                status: '已新增類別！'
            });
        } catch (err) {
            cb(err);
        }
    },
    postColor: async (req, cb) => {
        try {
            const { name } = req.body;
            if (!name) throw new Error('所有欄位不得為空!');
            await Color.create({
                name
            });
            const color = await Color.findOne({
                where: { name }
             });

            if (color) {
                throw new Error('此顏色種類已存在！');
            }
            cb(null, {
                status: '已新增顏色！'
            });
        } catch (err) {
            cb(err);
        }
    },
    postSize: async (req, cb) => {
        try {
            const { name } = req.body;
            if (!name) throw new Error('所有欄位不得為空!');
            const size = await Size.findOne({
                where: { name }
             });
            if (size) {
                throw new Error('尺寸種類已存在！');
            }
            await Size.create({
                name
            });
            cb(null, {
                status: '已新增尺寸！'
            });
        } catch (err) {
            cb(err);
        }
    },
    postMethod: async (req, cb) => {
        try {
            const { name } = req.body;
            if (!name) throw new Error('所有欄位不得為空!');
            const method = await Method.findOne({
                where: { name }
             });

            if (method) {
                throw new Error('此付款方式已存在！');
            }
            await Method.create({
                name
            });

            cb(null, {
                status: '已新增付款方式！'
            });
        } catch (err) {
            cb(err);
        }
    }
    
};
  
module.exports = adminServices