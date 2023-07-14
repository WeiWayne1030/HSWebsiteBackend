const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')
const {
    User
} = require('../models')

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
        if (user.role === 'admin') throw new Error('帳號不存在！')
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
  }
}

module.exports = userServices