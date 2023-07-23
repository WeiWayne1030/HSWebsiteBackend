const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')
const sequelize = require('sequelize')
const helpers = require('../_helpers')
const { Op } = require('sequelize')
const { User, Order, Method,Cart, OrderInfo,Stock, Item } = require('../models')
const { localFileHandler } = require('../helpers/imgurFileHandler')

const userServices = {
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
            if (user.role === 'seller') throw new Error('帳號不存在！')
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
    signUp: async(req, cb) => {
        try {
            const {
                email, name, account, password, checkPassword
            } = req.body
            console.log(email, name, account, password, checkPassword)
            if (!email || !name || !account || !password || !checkPassword) throw new Error('所有欄位皆為必填！')
            const users = await User.findAll()
            if (users.length > 0) {
                const existingAccount = users.find(user => user.account === account)
                const existingEmail = users.find(user => user.email === email)
                if (existingAccount) {
                    throw new Error('帳號已存在！')
                } else if (existingEmail) {
                    throw new Error('信箱已存在！')
                }
            }
            if (!name) throw new Error('請填入名稱！')
            if (name.length >= 50) throw new Error('名稱不可超過50字！')
            if (password !== checkPassword) throw new Error('密碼與確認密碼不一致！')
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)
            const newUser = await User.create({
                name,
                account,
                email,
                role: 'user',
                password: hash
            })
            const userData = newUser.toJSON()
            delete userData.password
            cb(null, {
                status: 'success',
                message: '註冊成功！',
                user: userData
            })
        } catch (err) {
            cb(err)
        }
    },
    getUser: async (req, cb) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        const { password, ...userData } = user.toJSON();
        cb(null, userData);
    } catch (err) {
        cb(err);
    }
    },
    putUser: async (req, cb) => {
        const { id } = req.params
        const { name, account, email, password, sex, telNumber, introduction,checkPassword } = req.body
        const { file } = req
        if (!name) throw new Error('請填入名稱！')
        if (password !== checkPassword) throw new Error('密碼與確認密碼不一致！')
        if (name.length >= 50) throw new Error('名稱不可超過50字！')
        if (introduction.length >= 160) throw new Error('自我介紹不可超過160字！')
        let salt = null
        let hash = null
        if (password) {
            salt = bcrypt.genSaltSync(10)
            hash = bcrypt.hashSync(password, salt)
        }
        return Promise.all([
            User.findAll({
                raw: true,
                where: { id: { [Op.ne]: id } } // 找出除了使用者本人以外的所有使用者
            }),
            User.findByPk(id),
            localFileHandler(file)
        ])
            .then(([allUsers, user, filePath]) => {
                if (allUsers.length > 0) {
                    const existingAccount = allUsers.find(user => user.account === account)
                    const existingEmail = allUsers.find(user => user.email === email)
                    if (existingAccount) {
                        throw new Error('帳號已存在！')
                    } else if (existingEmail) {
                        throw new Error('信箱已存在！')
                    }
                }
                if (!user) throw new Error("使用者不存在！")
                if (user.id !== Number(id)) throw new Error('只能編輯自己的使用者資料！')
                user.update({
                    name,
                    account,
                    email,
                    password: hash || user.password,
                    sex,
                    telNumber,
                    introduction,
                    avatar: filePath || user.avatar,
                })
                    .then(updateUser => {
                        const userData = updateUser.toJSON()
                        delete userData.password
                        cb(null, userData)
                    })
                    .catch(err => {
                        cb(err)
                    })
            })
            .catch(err => {
                cb(err)
            })
    },
    ordeInfo: async (req, cb) => {
        try {
            const { id } = req.params;
            const userId = helpers.getUser(req).id;
            const { shipName, address, shipTel, MethodId } = req.body;


            const order = await Order.findOne({
                where: { OrderInfoId: id },
            });

            const method = await Method.findByPk(MethodId);
            if (!method) {
                throw new Error('運送方式不存在');
            }
            if (!order) {
                throw new Error('訂單不存在');
            }
            if (order.UserId !== userId) {
                throw new Error('只能編輯自己的訂單');
            }
            const orderInfo = await OrderInfo.create({
                UserId: userId,
                shipName,
                address,
                shipTel,
                MethodId,
            });
            cb(null, orderInfo);
        } catch (err) {
            cb(err);
        }
    },
    buildOrder: async (req, cb) => {
        try {
            const { id } = req.params;
            const userId = helpers.getUser(req).id;
            const carts = await Cart.findAll({
            where: {
                id,
                UserId: userId,
            },
            include: [
                {
                model: Stock,
                include: [
                    {
                    model: Item,
                    },
                ],
                },
            ],
            });
            if (carts.length === 0) {
            return cb(new Error("購物車不存在."));
            }

            // 建立訂單
            const order = await Order.create({
                UserId: userId,
                total: carts.reduce((a, b) => a + b.Stock.Item.price * b.itemQuantity, 0),
                state: false,
                itemQuantity: carts.reduce((a, b) => a + b.dataValues.amount, 0),
                CartId: id,
            });
            cb(null, order);
        } catch (err) {
            cb(err);
        }
    },
    putOrderInfo: async (req, cb) => {
        const { id } = req.params
        const { shipName, address, shipTel, MethodId } = req.body
        const { file } = req
        if (!shipName || !address || !shipTel || !MethodId) throw new Error('所有欄位皆為必填！')
        if (shipName.length >= 50) throw new Error('收件人姓名不可超過50字！')
        if (address.length >= 160) throw new Error('收件地址不可超過160字！')
        if (shipTel.length >= 20) throw new Error('收件人電話不可超過20字！')
        return Promise.all([
            OrderInfo.findAll({
                raw: true,
                where: { id: { [Op.ne]: id } } // 找出除了使用者本人以外的所有使用者
            }),
            OrderInfo.findByPk(id),
            localFileHandler(file)
        ])
            .then(([allOrderInfos, orderInfo, filePath]) => {
                if (allOrderInfos.length > 0) {
                    const existingShipName = allOrderInfos.find(orderInfo => orderInfo.shipName === shipName)
                    const existingAddress = allOrderInfos.find(orderInfo => orderInfo.address === address)
                    const existingShipTel = allOrderInfos.find(orderInfo => orderInfo.shipTel === shipTel)
                    if (existingShipName) {
                        throw new Error('收件人姓名已存在！')
                    } else if (existingAddress) {
                        throw new Error('收件地址已存在！')
                    } else if (existingShipTel) {
                        throw new Error('收件人電話已存在！')
                    }
                }
                if (!orderInfo) throw new Error("訂單不存在！")
                if (orderInfo.id !== Number(id)) throw new Error('只能編輯自己的訂單！')
                orderInfo.update({
                    shipName,
                    address,
                    shipTel,
                    MethodId,
                    avatar: filePath || orderInfo.avatar,
                })
                    .then(updateOrderInfo => {
                        const orderInfoData = updateOrderInfo.toJSON()
                        cb(null, orderInfoData)
                    })
                    .catch(err => {
                        cb(err)
                    })
            }
        )
    },
    getOrders: async (req, cb) => {
    try {
        const user = helpers.getUser(req);
        if (!user || !user.id) {
            throw new Error('無法取得使用者資訊或使用者ID');
        }
        const userId = user.id;
        const orders = await Order.findAll({
            where: { UserId: userId,
             },
            include: [
                {
                    model: Cart,
                        // include: [
                        //     {
                        //         model: Stock,
                        //         include: [
                        //             {
                        //                 model: Item,
                        //             },
                        //         ],
                        //     },
                        // ],
                },
                {
                    model: OrderInfo,
                    include: [
                        {
                            model: Method,

                        },
                    ],
                },
            ],
        });
        if (!orders) {
            throw new Error('無法取得訂單資訊');
        }
        if (orders.length === 0) {
            throw new Error('無訂單資訊');
        }   
        cb(null, orders);
    } catch (err) {
        cb(err);
    }
},

    getOrder: async (req, cb) => {
        try {
            const { orderId } = req.params;
            const userId = helpers.getUser(req).id;
            const order = await Order.findOne({
                where: { id: orderId, UserId: userId },
                include: [
                    {
                        model: Cart,
                        include: [
                            {
                                model: Stock,
                                include: [
                                    {
                                        model: Item,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        model: OrderInfo,
                        include: [
                            {
                                model: Method,
                            },
                        ],
                    },
                ],
            });
            cb(null, order);
        } catch (err) {
            cb(err);
        }
    }
}
module.exports = userServices