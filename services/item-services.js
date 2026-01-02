const { Item, Category, Color, Size } = require('../models')

const itemServices = {
  // =========================
  // 商品列表（加 Redis 快取）
  // =========================
  getItems: async (req, cb) => {
    const redis = req.redisClient
    const categoryId = Number(req.query.CategoryId) || null

    // Redis Key
    const cacheKey = categoryId
      ? `items:list:category:${categoryId}`
      : 'items:list:all'

    try {
      // 1️⃣ 先查 Redis
      const cache = await redis.get(cacheKey)
      if (cache) {
        return cb(null, JSON.parse(cache))
      }

      // 2️⃣ 查 DB
      const [items, categories] = await Promise.all([
        Item.findAll({
          where: {
            state: true,
            ...(categoryId ? { categoryId } : {})
          },
          include: Category,
          nest: true,
          raw: true
        }),
        Category.findAll({
          where: { state: true },
          raw: true
        })
      ])

      const result = {
        items,
        categories,
        categoryId
      }

      // 3️⃣ 存 Redis（5 分鐘）
      await redis.set(cacheKey, JSON.stringify(result), { EX: 300 })

      return cb(null, result)
    } catch (err) {
      return cb(err)
    }
  },

  // =========================
  // 商品詳情（加 Redis 快取）
  // =========================
  getItem: async (req, cb) => {
    const redis = req.redisClient
    const { id } = req.params
    const cacheKey = `item:detail:${id}`

    try {
      if (!id) {
        throw new Error('商品不存在！')
      }

      // 1️⃣ 先查 Redis
      const cache = await redis.get(cacheKey)
      if (cache) {
        return cb(null, JSON.parse(cache))
      }

      // 2️⃣ 查 DB
      const item = await Item.findOne({
        where: { id },
        include: [
          { model: Category, attributes: ['name'] },
          {
            model: Color,
            attributes: ['id', 'name', 'itemStock'],
            include: [
              { model: Size, attributes: ['name'] }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      })

      if (!item || !item.state) {
        return cb(null, {})
      }

      // 3️⃣ 合併庫存資料
      const mergedStocks = {}
      item.Colors.forEach(color => {
        if (!mergedStocks[color.name]) {
          mergedStocks[color.name] = {
            color: color.name,
            sizes: []
          }
        }
        mergedStocks[color.name].sizes.push(color.Size)
      })

      const data = {
        item,
        mergedStocks: Object.values(mergedStocks)
      }

      // 4️⃣ 存 Redis（10 分鐘）
      await redis.set(cacheKey, JSON.stringify(data), { EX: 600 })

      return cb(null, data)
    } catch (err) {
      return cb(err)
    }
  }
}

module.exports = itemServices