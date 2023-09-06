const { localFileHandler } = require('../helpers/imgurFileHandler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const { switchTime } = require('../helpers/dayjs-helpers')
const { getOffset, getPagination } = require('../helpers/pagination-helper')


const { Item, Color, Size, Cart, User, Order, Method, Category } = require('../models');

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
        const categoryId = Number(req.query.CategoryId) || ""
        const stateParam = req.query.state || ""

        try {
            const [items, categories] = await Promise.all([
                Item.findAll({
                where: stateParam !== "" ? { state: stateParam } : {},
                include: Category,
                where: categoryId !== "" ? { categoryId } : {},
                nest: true,
                raw: true,
                }),
                Category.findAll({ raw: true }),
            ])
            

            itemsInfo = await items.map(item => {
                return {...item,
                    createdAt: switchTime(item.createdAt),
                    updatedAt: switchTime(item.updatedAt)
                }
            })

            cb(null, {
                itemsInfo,
                categories,
                categoryId,
                stateParam,
            })
        } catch (err) {
            cb(err)
        }
    },
    getStocks: async (req, cb) => {
        const categoryId = Number(req.query.CategoryId) || ""
        const stateParam = req.query.state || ""
        const productNumberParam = req.query.productNumber || ""

        try {
            const [colors, items, categories] = await Promise.all([
                Color.findAll({
                    where: productNumberParam !== "" ? { productNumber: productNumberParam } : {},
                    include: [
                        {
                            model: Size
                        },
                        {
                            model: Item,
                            where: [stateParam !== "" ? { state: stateParam } : {}],
                            include: {
                                model: Category,
                                where: categoryId !== "" ? { id: categoryId } : {},
                            },
                            nest: true,
                            raw: true,
                        }
                    ],
                    nest: true,
                    raw: true,
                }),
                Item.findAll({
                    model: Category
                }),
                Category.findAll({ raw: true }),
            ])
            

            stocksInfo = await colors.map(color => {
                return {...color,
                    createdAt: switchTime(color.createdAt),
                    updatedAt: switchTime(color.updatedAt)
                }
            })

            cb(null, {
                stocksInfo,
                items,
                categories,
                categoryId,
                stateParam,
                productNumberParam
            })
        } catch (err) {
            cb(err)
        }
    },
    removeItem: async (req, cb) => {
        try {
            const { id } = req.params

            // 1. 查找商品
            const item = await Item.findByPk(id)
            if (!item) {
                throw new Error('找不到對應的商品！')
            }

            // 2. 更新狀態為false
            await Item.update({ state: false }, { where: { id } })

            // 3. 查找商品的顏色相關紀錄
            const colorRecords = await Color.findAll({ where: { ItemId: id }, attributes: ['id'] })

 
            // 4. 刪除購物車中相關商品
            const stockIds = colorRecords.map(stock => stock.id)
            if(stockIds){
                await Cart.destroy({ where: { ColorId: stockIds } })
            }
            
            cb(null, { status: '已下架商品！' })

        } catch (err) {
            cb(err)
            console.error(err)
        }
    },
    relistItem: async (req, cb) => {
        try {
            const { id } = req.params

            // 1. 查找商品
            const item = await Item.findByPk(id)
            if (!item) {
                throw new Error('找不到對應的商品！')
            }

            // 2. 更新狀態為true
            await Item.update({ state: true }, { where: { id } })
            
            cb(null, { status: '已上架商品！' })

        } catch (err) {
            cb(err)
            console.error(err)
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
    // postStock: async (req, cb) => {
    //     try {
    //         const id = req.params.stockId;
    //         const { itemStock, ColorId, SizeId } = req.body;
    //         if (!itemStock || !ColorId || !SizeId) {
    //             throw new Error('所有欄位不得為空!');
    //         }
    //         if (!id) {
    //             throw new Error('此商品不存在！');
    //         }
    //         const item = await Item.findOne({
    //             where: { id }
    //         });
    //         if (!item) {
    //             throw new Error('找不到對應的商品！');
    //         }
    //         const stock = await Stock.findOne({
    //             where: { ItemId: id, ColorId, SizeId }
    //         });
    //         if (stock) {
    //             throw new Error('此商品庫存已存在！');
    //         }
    //         if (itemStock < 0) {
    //             throw new Error('庫存不得小於0！');
    //         }
    //         await Stock.create({
    //             productNumber: `ST${Date.now().toString().padStart(10, '0')}`,
    //             itemStock,
    //             ColorId,
    //             SizeId,
    //             ItemId: id
    //         });
    //         cb(null, {
    //             status: '已新增庫存！'
    //         });
    //     } catch (err) {
    //         console.error(err);
    //         cb(err);
    //     }
    // },
    getOrders: async (req, cb) => {
    try {
        const DEFAULT_LIMIT = 9;
        const MethodId = Number(req.query.MethodId) || '';
        const state = req.query.state || "";
        const orderNumber = req.query.orderNumber || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || DEFAULT_LIMIT;
        const offset = getOffset(limit, page);
        const [orders, methods] = await Promise.all([
            Order.findAndCountAll({
                include: [
                    {
                        model: Method,
                        where: MethodId ? { MethodId } : {},
                    }
                ],
                limit,
                offset
            }),
            Method.findAll({ raw: true })
        ]);

        const orderInfos = orders.rows.map(order => {
            return {
                ...order.dataValues, 
                createdAt: switchTime(order.createdAt),
                updatedAt: switchTime(order.updatedAt)
            }
        });

        const pagination = getPagination(limit, page, orders.count);

        cb(null, { orderInfos, methods, MethodId, pagination, state, orderNumber });
    } catch (err) {
        cb(err);
    }
},
    // slGetOrderInfo: async (req, cb) => {
    //     try {
    //         const id = req.params.id;
    //         if (!id) {
    //             throw new Error('此訂單不存在！');
    //         }
    //         const orderInfo = await OrderInfo.findOne({
    //             id,
    //             include: [{
    //                     model: Method   
    //         }],

    //             order: [['createdAt', 'DESC']] 
    //         });
    //         if (!orderInfo) {
    //             throw new Error('找不到對應的訂單！');
    //         }
    //         cb(null, orderInfo);
    //     } catch (err) {
    //         cb(err);
    //     }
    // },
    // putStock: async (req, cb) => {
    //     try {
    //         const id = req.params.id;
    //         const { name, price, description, CategoryId, itemStock, ColorId, SizeId } = req.body;
    //         if (!name || !price || !description || !itemStock || !ColorId || !SizeId || !CategoryId) {
    //             throw new Error('所有欄位不得為空!');
    //         }

    //         // Find the stock record with the provided ID
    //         const stock = await Stock.findOne({
    //             where: { id: id },
    //             include: [{
    //                 model: Item
    //             }]
    //         });

    //         // Check if a valid stock record is found
    //         if (!stock) {
    //             throw new Error('找不到該庫存記錄!');
    //         }

    //         // Find the associated item
    //         const item = stock.Item;

    //         const { file } = req;
    //         const filePath = await localFileHandler(file);

    //         // Update the item details
    //         await item.update({
    //             name,
    //             price,
    //             description,
    //             image: filePath || null,
    //             CategoryId
    //         });

    //         // Update the stock details
    //         await stock.update({
    //             itemStock,
    //             ColorId,
    //             SizeId
    //         });

    //         cb(null, {
    //             status: '已更新庫存！'
    //         });
    //     } catch (err) {
    //         cb(err);
    //     }
    // },

    //種類
postCategory: async (req, cb) => {
    try {
        const { name } = req.body;
        
        if (!name) {
            throw new Error('所有欄位不得為空!');
        }
        
        const existingCategory = await Category.findOne({
            where: { name: name }
        });

        if (existingCategory) {
            throw new Error('此種類已存在！');
        }
         
        const newCategory = await Category.create({
            name: name,
            state: 1
        });

            cb(null, {newCategory,
                status: '已新增類別！'
            });
        } catch (err) {
            cb(err);
        }
    },
    getCategories: async (req, cb) => {
        try{
            const categories = await Category.findAll({
                attributes:['id', 'name', 'state']
            })
            cb(null, categories);
        } catch(err) {
             cb(err);
        }
    },
    putCategory: async (req, cb) => {
        try{
            const { id } = req.params
            const { name } = req.body
            const category = await Category.findOne({
                where:{ id },
                attributes:['id', 'name', 'state']
            })
            if (!category) throw new Error('種類不存在！')
            if (!name) throw new Error('請輸入名稱！')
            if (category.name === name) throw new Error('名稱已存在！')

            await category.update({
                name: name,
                state: 1
            })
            cb(null,{
                status: '修改成功！'
            } );
        } catch(err) {
             cb(err);
        }
    },
    removeCategory: async(req, cb) => {
        try{
            const { id } = req.params
            const category = await Category.findOne({
                where:{ id },
                attributes:['id', 'name', 'state']
            })
            if (!category) throw new Error('種類不存在！')

            await category.update({
                state: 0
            })
            cb(null,{
                status: '移除成功！'
            } );
        } catch(err) {
             cb(err);
        }
    },
    relistCategory: async(req, cb) => {
        try{
            const { id } = req.params
            const category = await Category.findOne({
                where:{ id },
                attributes:['id', 'name', 'state']
            })
            if (!category) throw new Error('種類不存在！')

            await category.update({
                state: 1
            })
            cb(null,{
                status: '恢復成功！'
            } );
        } catch(err) {
             cb(err);
        }
    },
    delCategory: async(req, cb) => {
        try{
            const { id } = req.params
            const category = await Category.findByPk(id)
            if (!category) throw new Error('種類不存在！')

            await category.destroy()
            cb(null,{
                status: '刪除成功！'
            } );
        } catch(err) {
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

    //尺寸
    postSize: async (req, cb) => {
    try {
        const { name } = req.body;
        
        if (!name) {
            throw new Error('所有欄位不得為空!');
        }
        
        const existingSize = await Size.findOne({
            where: { name: name }
        });

        if (existingSize) {
            throw new Error('此種類已存在！');
        }
         
        const newSize = await Size.create({
            name: name,
            state: 1
        });

            cb(null, {newSize,
                status: '已新增類別！'
            });
        } catch (err) {
            cb(err);
        }
    },
    getSizes: async (req, cb) => {
        try{
            const sizes = await Size.findAll({
                attributes:['id', 'name', 'state']
            })
            cb(null, sizes);
        } catch(err) {
             cb(err);
        }
    },
    putSize: async (req, cb) => {
        try{
            const { id } = req.params
            const { name } = req.body
            const size = await Size.findOne({
                where:{ id },
                attributes:['id', 'name', 'state']
            })
            if (!size) throw new Error('尺寸不存在！')
            if (!name) throw new Error('請輸入名稱！')
            if (size.name === name) throw new Error('名稱已存在！')

            await size.update({
                name: name,
                state: 1
            })
            cb(null,{
                status: '修改成功！'
            } );
        } catch(err) {
             cb(err);
        }
    },
    removeSize: async(req, cb) => {
        try{
            const { id } = req.params
            const size = await Size.findOne({
                where:{ id },
                attributes:['id', 'name', 'state']
            })
            if (!size) throw new Error('尺寸不存在！')

            await size.update({
                state: 0
            })
            cb(null,{
                status: '移除成功！'
            } );
        } catch(err) {
             cb(err);
        }
    },
    relistSize: async(req, cb) => {
        try{
            const { id } = req.params
            const size = await Size.findOne({
                where:{ id },
                attributes:['id', 'name', 'state']
            })
            if (!size) throw new Error('尺寸不存在！')

            await size.update({
                state: 1
            })
            cb(null,{
                status: '恢復成功！'
            } );
        } catch(err) {
             cb(err);
        }
    },
    delSize: async(req, cb) => {
        try{
            const { id } = req.params
            const size = await Size.findByPk(id)
            if (!size) throw new Error('種類不存在！')

            await size.destroy()
            cb(null,{
                status: '刪除成功！'
            } );
        } catch(err) {
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
    },
    


    // delItem: async (req, cb) => {
    //     try {
    //         const id = req.params.id;

    //         // 筛选在Stock模型中符合req.params.id的ItemId的Stock.id
    //         const stockIds = await Color.findAll({
    //         where: { ItemId: id },
    //         attributes: ['id'],
    //         }).map(stock => stock.id);


    //         // 删除Item模型中的所有记录
    //         await Item.destroy({
    //         where: { id: id },
    //         });

    //         // 删除Cart模型中与筛选出的StockId相匹配的记录
    //         if (stockIds){
    //             await Cart.destroy({
    //             where: { ColorId: stockIds },
    //             });
    //         }
            
    //         //删除Color模型中与筛选出的StockId相匹配的记录
    //         await Color.destroy({
    //         where: { ItemId: id },
    //         });

    //         cb(null, {
    //         status: '產品已刪除！',
    //         });
    //     } catch (err) {
    //     cb(err);
    //     }
    // }

};
  
module.exports = adminServices