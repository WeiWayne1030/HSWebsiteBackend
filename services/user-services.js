const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')
const sequelize = require('sequelize')
const helpers = require('../_helpers')
const { Op } = require('sequelize')
const { User, Order, Method,Cart } = require('../models')
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
    pay: async (req, cb) => {
        try {
            const userId = helpers.getUser(req).id
            const { shipName, address, shipTel, MethodId } = req.body;
            
            const carts = await Cart.findAll({
                where: { UserId: userId },
                atrributes: ['amount'],
            });
        
            const orderNumber = `OR${Date.now().toString().padStart(10, '0')}`;
            const totalAmount = carts.reduce((a, b) => a + b.amount, 0);
            const order = await Order.create({
                orderNumber: orderNumber,
                UserId: userId,
                shipName,
                address,
                shipTel,
                MethodId,
                total: totalAmount,
            });
            
            cb(null, order);
        } catch (err) {
            cb(err);
        }
    },
    editOrder: async (req, cb) => {
    try {
        const { orderId } = req.params;
        const { shipName, address, shipTel, MethodId } = req.body;
        const order = await Order.findByPk(orderId)

        if (!order) {
            return cb(new Error("訂單不存在."));
        }

        if (order.dataValues.UserId != helpers.getUser(req).id) {
            return cb(new Error("只能編輯自己的訂單."));
        }

        await order.update(
            {
                shipName,
                address,
                shipTel,
                MethodId,
            }
        );

        cb(null, order);
    } catch (err) {
        cb(err);
    }
    }

}

module.exports = userServices