const { Item, Stock, Color, Size, Cart, Category } = require('../models')
const helpers = require('../_helpers')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const cartServices = {
  getCarts: async (req, cb) => {
    try {
      const redis = req.redisClient
      const userId = helpers.getUser(req).id

      const cartKey = `cart:${userId}`
      const cart = await redis.hGetAll(cartKey)

      if (!cart || Object.keys(cart).length === 0) {
        throw new Error('目前沒有任何物品在購物車裡！')
      }

      // cart = { colorId: quantity }
      cb(null, cart)
    } catch (err) {
      cb(err)
    }
  },
  addToCart: async (req, cb) => {
    const redis = req.redisClient
    const userId = helpers.getUser(req).id
    const colorId = Number(req.body.ColorId)
    const quantity = Number(req.body.itemQuantity)

    const cartKey = `cart:${userId}`
    const stockKey = `stock:${colorId}`
    const lockKey = `cart:lock:${userId}`

    try {
      // 1️⃣ 防重複請求（Lock）
      const locked = await redis.set(lockKey, '1', { NX: true, EX: 5 })
      if (!locked) throw new Error('請勿重複操作')

      // 2️⃣ 檢查是否已在購物車
      const exists = await redis.hExists(cartKey, colorId)
      if (exists) throw new Error('你已經加入購物車')

      // 3️⃣ 扣 Redis 庫存（原子）
      const remain = await redis.decrBy(stockKey, quantity)
      if (remain < 0) {
        await redis.incrBy(stockKey, quantity)
        throw new Error('庫存不足')
      }

      // 4️⃣ 加入購物車
      await redis.hSet(cartKey, colorId, quantity)
      await redis.expire(cartKey, 3600)

      cb(null, { status: '已加入購物車！' })
    } catch (err) {
      cb(err)
    } finally {
      await redis.del(lockKey)
    }
  },
  delCart: async (req, cb) => {
    try {
      const redis = req.redisClient
      const userId = helpers.getUser(req).id
      const colorId = req.params.id

      const cartKey = `cart:${userId}`
      const stockKey = `stock:${colorId}`

      const quantity = await redis.hGet(cartKey, colorId)
      if (!quantity) throw new Error('購物車裡沒有該品項')

      // 歸還庫存
      await redis.incrBy(stockKey, Number(quantity))

      // 刪購物車項目
      await redis.hDel(cartKey, colorId)

      cb(null, { status: '已將該品項移除' })
    } catch (err) {
      cb(err)
    }
  }
  
  // delCarts: async (req, cb) => {
  //     try {
  //         const userId = helpers.getUser(req).id
  //         const carts = await Cart.findAll({
  //             where: { UserId: userId },
  //         })

  //         if (carts.length === 0) {
  //             throw new Error('目前沒有任何訂單！')
  //         }

  //         await Cart.destroy({
  //             where: { UserId: userId },
  //         })

  //         cb(null, {
  //       status: '已刪除全部品項！'
  //     })
  //     } catch (err) {
  //         cb(err)
  //     }
  // },
}


module.exports = cartServices