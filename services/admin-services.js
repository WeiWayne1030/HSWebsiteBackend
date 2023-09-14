const { imgurFileHandler } = require('../helpers/imgurFileHandler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const { switchTime } = require('../helpers/dayjs-helpers')
const { getOffset, getPagination } = require('../helpers/pagination-helper')


const { Item, Color, Size, Cart, User, Order, Method, Category } = require('../models')

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

    //商品
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
            const { name, price, description, CategoryId } = req.body
            if (!name || !price || !description || !CategoryId ) {
                throw new Error('所有欄位不得為空!')
            }
            const item = await Item.findOne({
            where: { name }
            })

            if (item) {
                throw new Error('此商品已存在！')
            }
            const { file } = req.body
            
            const filePath = await imgurFileHandler(file)
            console.log(filePath)
            newItem = await Item.create({
                name,
                state: 1,
                price,
                description,
                image: filePath || null,
                CategoryId
            })

            cb(null, { newItem,
                status: '新增成功！'
            })
        } catch (err) {
            cb(err)
        }
    },
    // delItem: async (req, cb) => {
    //     try {
    //         const id = req.params.id

    //         // 篩選在Stock模型中符合req.params.id的ItemId的Stock.id
    //         const stockIds = await Color.findAll({
    //         where: { ItemId: id },
    //         attributes: ['id'],
    //         }).map(stock => stock.id)

    //         await Item.destroy({
    //         where: { id: id },
    //         })

    //         // 刪除Cart模型中與篩選出的StockId相匹配的記錄
    //         if (stockIds){
    //             await Cart.destroy({
    //             where: { ColorId: stockIds },
    //             })
    //         }
            
    //         //刪除Color模型中與篩選出的StockId相匹配的記錄
    //         await Color.destroy({
    //         where: { ItemId: id },
    //         })

    //         cb(null, {
    //         status: '產品已刪除！',
    //         })
    //     } catch (err) {
    //     cb(err)
    //     }
    // },
    
    //訂單
    getOrders: async (req, cb) => {
        try {
            const DEFAULT_LIMIT = 9
            const MethodId = Number(req.query.MethodId) || ''
            const state = req.query.state || ""
            const orderNumber = req.query.orderNumber || ""
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || DEFAULT_LIMIT
            const offset = getOffset(limit, page)
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
            ])

            const orderInfos = orders.rows.map(order => {
                return {
                    ...order.dataValues, 
                    createdAt: switchTime(order.createdAt),
                    updatedAt: switchTime(order.updatedAt)
                }
            })

            const pagination = getPagination(limit, page, orders.count)

            cb(null, { orderInfos, methods, MethodId, pagination, state, orderNumber })
        } catch (err) {
            cb(err)
        }
    },
    getOrderItems: async (req, cb) => {
    try {
        const orderNumber = req.params.orderNumber
        if (!orderNumber) {
            throw new Error('此訂單不存在！')
        }

        const orderItems = await Cart.findAll({
            where: { orderNumber },
            include: [{
                model: Color,
                include: [{
                    model: Item
                },
                {
                    model: Size
                }]
            }]
        })

        if (!orderItems || orderItems.length === 0) { 
            throw new Error('找不到對應的訂單！')
        }

        cb(null, orderItems)
    } catch (err) {
        cb(err)
    }
    },
    // putStock: async (req, cb) => {
    //     try {
    //         const id = req.params.id
    //         const { name, price, description, CategoryId, itemStock, ColorId, SizeId } = req.body
    //         if (!name || !price || !description || !itemStock || !ColorId || !SizeId || !CategoryId) {
    //             throw new Error('所有欄位不得為空!')
    //         }

    //         // Find the stock record with the provided ID
    //         const stock = await Order.findOne({
    //             where: { id: id },
    //             include: [{
    //                 model: Item
    //             }]
    //         })

    //         // Check if a valid stock record is found
    //         if (!stock) {
    //             throw new Error('找不到該庫存記錄!')
    //         }

    //         // Find the associated item
    //         const item = stock.Item

    //         const { file } = req
    //         const filePath = await localFileHandler(file)

    //         // Update the item details
    //         await item.update({
    //             name,
    //             price,
    //             description,
    //             image: filePath || null,
    //             CategoryId
    //         })

    //         // Update the stock details
    //         await stock.update({
    //             itemStock,
    //             ColorId,
    //             SizeId
    //         })

    //         cb(null, {
    //             status: '已更新庫存！'
    //         })
    //     } catch (err) {
    //         cb(err)
    //     }
    // },
    
    //庫存
    getStocks: async (req, cb) => {
        const categoryId = Number(req.query.CategoryId) || ""
        const stateParam = req.query.state || ""
        const productNumberParam = req.query.productNumber || ""

        try {
            const [stocks, items, categories, sizes, colors] = await Promise.all([
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
                Size.findAll({raw: true}),
                Color.findAll({
                attributes: ['name'],
                group: ['name'], // 使用GROUP BY確保獲取不同顏色
                raw: true 
            })
            ])
            

            stocksInfo = await stocks.map(stock => {
                return {...stock,
                    createdAt: switchTime(stock.createdAt),
                    updatedAt: switchTime(stock.updatedAt)
                }
            })

            cb(null, {
                stocksInfo,
                items,
                sizes,
                categories,
                colors,
                categoryId,
                stateParam,
                productNumberParam
            })
        } catch (err) {
            cb(err)
        }
    },
    putStockNumber: async (req, cb) => {
        try {
            const { productNumber, itemStock } =  req.body
            const stock = await Color.findOne ({
                where: {productNumber: productNumber} 
            })
            if (!stock) throw new Error('商品不存在！')
            if (!itemStock) throw new Error('請輸入數量！')

            await stock.update({
                itemStock:itemStock
            })
            cb(null,{
                status: '修改成功！'
            } ) 
        } catch(err) {
            cb(err)
        }
    },
    addStock: async (req, cb) => {
        try {
        const {ItemId, colorName , SizeId, itemStock } = req.body
        const stocks = await Color.findAll({
                include: Item
            },
            {
                include:Size    
            })
        // 設定一個變數顯示庫存已存在
        let stockExists = false


        //檢查匹配的庫存
        for (const stock of stocks) {
            console.log('商品',stock.ItemId)
            if (stock.ItemId === Number(ItemId) && stock.name === colorName && stock.SizeId === Number(SizeId)) {
                stockExists = true
                break
            }
        }

        if (stockExists) {
            throw new Error('庫存已存在!')
        }

        let productNumberCounter = 1
        let productNumber = `ST${productNumberCounter.toString().padStart(6, '0')}`
        
        // 循環檢查是否已經存在相同的productNumber
        while (true) {
            const existingColor = await Color.findOne({ where: { productNumber } })
            
            if (!existingColor) {
                break // 找到唯一的productNumber，退出循環
            }
            
            // 如果已存在相同的productNumber，遞增增计数器並重新生成productNumber
            productNumberCounter++
            productNumber = `ST${productNumberCounter.toString().padStart(6, '0')}`
        }

         const newStock = await Color.create({
            productNumber,
            ItemId,
            state: 1,
            name: colorName,
            SizeId,
            itemStock
        })
            cb(null, {newStock,
                    status: '已新增類別！'
                })
            } catch (err) {
                cb(err)
            }
    },

    //種類
    postCategory: async (req, cb) => {
    try {
        const { name } = req.body
        
        if (!name) {
            throw new Error('所有欄位不得為空!')
        }
        
        const existingCategory = await Category.findOne({
            where: { name: name }
        })

        if (existingCategory) {
            throw new Error('此種類已存在！')
        }
         
        const newCategory = await Category.create({
            name: name,
            state: 1
        })

            cb(null, {newCategory,
                status: '已新增類別！'
            })
        } catch (err) {
            cb(err)
        }
    },
    getCategories: async (req, cb) => {
        try{
            const categories = await Category.findAll({
                attributes:['id', 'name', 'state']
            })
            cb(null, categories)
        } catch(err) {
             cb(err)
        }
    },
    putCategory: async (req, cb) => {
        try{
            const { name,id } = req.body
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
            } )
        } catch(err) {
             cb(err)
        }
    },
    removeCategory: async(req, cb) => {
        try{
            const { id } = req.body
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
            } )
        } catch(err) {
             cb(err)
        }
    },
    relistCategory: async(req, cb) => {
        try{
            const { id } = req.body
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
            } )
        } catch(err) {
             cb(err)
        }
    },
    delCategory: async(req, cb) => {
        try{
            const { id } = req.body
            const category = await Category.findByPk(id)
            if (!category) throw new Error('種類不存在！')

            await category.destroy()
            cb(null,{
                status: '刪除成功！'
            } )
        } catch(err) {
             cb(err)
        }
    },
    

    //顏色
    postColor: async (req, cb) => {
    try {
        const { name } = req.body
        
        if (!name) throw new Error('名稱為必填！')
        
        const colors = await Color.findAll()

       // 使用some方法检查是否存在匹配的颜色数据
        if (colors.some(colorItem => colorItem.name === name )) {
            throw new Error('此顏色資料已存在！')
        }
        let productNumberCounter = 1
        let productNumber = `ST${productNumberCounter.toString().padStart(6, '0')}`
        
        // 循环检查是否已经存在相同的productNumber
        while (true) {
            const existingColor = await Color.findOne({ where: { productNumber } })
            
            if (!existingColor) {
                break // 找到唯一的productNumber，退出循環
            }
            
            // 如果已存在相同的productNumber，遞增增计数器並重新生成productNumber
            productNumberCounter++
            productNumber = `ST${productNumberCounter.toString().padStart(6, '0')}`
        }
         
        const newColor = await Color.create({
            productNumber: productNumber,
            name: name,
            state: 1
        })

            cb(null, {newColor,
                status: '已新增顏色！'
            })
        } catch (err) {
            cb(err)
        }
    },
    getColors: async (req, cb) => {
        try {
            const colors = await Color.findAll({
                attributes: ['name'],
                group: ['name'], // 使用GROUP BY確保獲取不同顏色
                raw: true 
            })

            // 提取不同的颜色名稱提到uniqueColorNames
            const uniqueColorNames = colors.map(color => ({ color: color.name }))
            cb(null, uniqueColorNames)
        } catch (err) {
            cb(err)
        }
    },
    // removeColor: async(req, cb) => {
    //     try{
    //         const { id } = req.params
    //         const color = await Color.findOne({
    //             where:{ id },
    //             attributes:['id', 'name', 'state']
    //         })
    //         if (!color) throw new Error('尺寸不存在！')

    //         await color.update({
    //             state: 0
    //         })
    //         cb(null,{
    //             status: '移除成功！'
    //         } )
    //     } catch(err) {
    //          cb(err)
    //     }
    // },
    // relistColor: async(req, cb) => {
    //     try{
    //         const { id } = req.params
    //         const color = await Color.findOne({
    //             where:{ id },
    //             attributes:['id', 'name', 'state']
    //         })
    //         if (!color) throw new Error('尺寸不存在！')

    //         await color.update({
    //             state: 1
    //         })
    //         cb(null,{
    //             status: '恢復成功！'
    //         } )
    //     } catch(err) {
    //          cb(err)
    //     }
    // },
    delColor: async(req, cb) => {
        try{
            const { name } = req.body
            const color = Color.findAll({
            })
            if (!color) throw new Error('顏色不存在！')
            await Color.destroy({
                where: { name: name }
            });
            cb(null,{
                status: '刪除成功！'
            } )
        } catch(err) {
             cb(err)
        }
    },

    //尺寸
    postSize: async (req, cb) => {
        try {
            const { name } = req.body
            
            if (!name) {
                throw new Error('所有欄位不得為空!')
            }
            
            const existingSize = await Size.findOne({
                where: { name: name }
            })

            if (existingSize) {
                throw new Error('此種類已存在！')
            }
            
            const newSize = await Size.create({
                name: name,
                state: 1
            })

                cb(null, {newSize,
                    status: '已新增類別！'
                })
            } catch (err) {
                cb(err)
            }
        },
    getSizes: async (req, cb) => {
        try{
            const sizes = await Size.findAll({
                attributes:['id', 'name', 'state']
            })
            cb(null, sizes)
        } catch(err) {
             cb(err)
        }
    },
    putSize: async (req, cb) => {
        try{
            const { id, name } = req.body
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
            })
        } catch(err) {
             cb(err)
        }
    },
    removeSize: async(req, cb) => {
        try{
            const { id } = req.body
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
            } )
        } catch(err) {
             cb(err)
        }
    },
    relistSize: async(req, cb) => {
        try{
            const { id } = req.body
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
            } )
        } catch(err) {
             cb(err)
        }
    },
    delSize: async(req, cb) => {
        try{
            const { id } = req.body
            const size = await Size.findByPk(id)
            if (!size) throw new Error('尺寸不存在！')

            await size.destroy()
            cb(null,{
                status: '刪除成功！'
            } )
        } catch(err) {
             cb(err)
        }
    },

    //付款方式
    postMethod: async (req, cb) => {
        try {
            const { name } = req.body
            
            if (!name) {
                throw new Error('所有欄位不得為空!')
            }
            
            const existingMethod = await Method.findOne({
                where: { name: name }
            })

            if (existingMethod) {
                throw new Error('此種類已存在！')
            }
            
            const newMethod = await Method.create({
                name: name,
                state: 1
            })

                cb(null, {newMethod,
                    status: '已新增類別！'
                })
            } catch (err) {
                cb(err)
            }
        },
    getMethods: async (req, cb) => {
        try{
            const methods = await Method.findAll({
                attributes:['id', 'name', 'state']
            })
            cb(null, methods)
        } catch(err) {
             cb(err)
        }
    },
    putMethod: async (req, cb) => {
        try{
            const { id, name } = req.body
            const method = await Method.findOne({
                where:{ id },
                attributes:['id', 'name', 'state']
            })
            if (!method) throw new Error('尺寸不存在！')
            if (!name) throw new Error('請輸入名稱！')
            if (method.name === name) throw new Error('名稱已存在！')

            await method.update({
                name: name,
                state: 1
            })
            cb(null,{
                status: '修改成功！'
            } )
        } catch(err) {
             cb(err)
        }
    },
    removeMethod: async(req, cb) => {
        try{
            const { id } = req.body
            const method = await Method.findOne({
                where:{ id },
                attributes:['id', 'name', 'state']
            })
            if (!method) throw new Error('尺寸不存在！')

            await method.update({
                state: 0
            })
            cb(null,{
                status: '移除成功！'
            } )
        } catch(err) {
             cb(err)
        }
    },
    relistMethod: async(req, cb) => {
        try{
            const { id } = req.body
            const method = await Method.findOne({
                where:{ id },
                attributes:['id', 'name', 'state']
            })
            if (!method) throw new Error('尺寸不存在！')

            await method.update({
                state: 1
            })
            cb(null,{
                status: '恢復成功！'
            } )
        } catch(err) {
             cb(err)
        }
    },
    delMethod: async(req, cb) => {
        try{
            const { id } = req.body
            const method = await Method.findByPk(id)
            if (!method) throw new Error('支付方式不存在！')

            await method.destroy()
            cb(null,{
                status: '刪除成功！'
            } )
        } catch(err) {
             cb(err)
        }
    },
    


    

}
  
module.exports = adminServices