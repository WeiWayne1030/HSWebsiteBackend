const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')

const userController = require('../controllers/user-controller')
const itemController = require('../controllers/item-controller')
const cartController = require('../controllers/cart-controller')
const adminController = require('../controllers/admin-controller')

const { authenticatedAdmin, authenticatedUser, authenticated } = require('../middleware/auth')

// signup & signin
//商家登入
router.post('/api/admin/signin', adminController.signIn)
//使用者登入
router.post('/api/users/signin', userController.signIn)
//使用者註冊
router.post('/api/users', userController.signUp)

//user
//使用者資料
router.get('/api/users/:id/profile', authenticated, authenticatedUser, userController.getUser)
//修改使用者資料
router.put('/api/users/:id/profile',upload.single('image'), authenticated, authenticatedUser, userController.putUser)

//order
//填寫訂單資料
router.post('/api/order/:id/orderInfo', authenticated, authenticatedUser, userController.orderInfo)
//建立訂單（未完成））
router.post('/api/cart/:id/orders', authenticated, authenticatedUser, userController.buildOrder)
//修改訂單資料（付款資料部分）
router.put('/api/orderInfos/:InfoId', authenticated, authenticatedUser, userController.putOrderInfo)
//取得該使用者單筆訂單資料
router.get('/api/orders/:id', authenticated, authenticatedUser, userController.getOrder)
//取得該使用者所有訂單資料
router.get('/api/orders', authenticated, authenticatedUser, userController.getOrders)

//admin
//查詢所有商品（上架下架）
router.get('/api/admin/items', authenticated, authenticatedAdmin, adminController.getItems)
//下架商品（未完成）
router.post('/api/admin/stock/:id/remove', authenticated, authenticatedAdmin, adminController.removeItem)
//上架商品
router.post('/api/admin/item',upload.single('image'), authenticated, authenticatedAdmin, adminController.postItem)
//新增商品庫存
router.post('/api/admin/items/:stockId', authenticated, authenticatedAdmin, adminController.postStock)
//刪除商品庫存
router.delete('/api/admin/stock/:id', authenticated, authenticatedAdmin, adminController.delItem)
//取得所有商品庫存
router.get('/api/admin/getAdminStock', authenticated, authenticatedAdmin, adminController.getAdminItems)
//修改商品庫存
router.put('/api/admin/stock/:id',upload.single('image'), authenticated, authenticatedAdmin, adminController.putStock)


//admin order
//取得所有訂單資料
router.get('/api/admin/orderInfos', authenticated, authenticatedAdmin, adminController.slGetOrderInfos)
//取得單筆訂單資料
router.get('/api/admin/orderInfos/:id', authenticated, authenticatedAdmin, adminController.slGetOrderInfo)


//admin etc
//新增商品分類
router.post('/api/admin/category', authenticated, authenticatedAdmin, adminController.postCategory)
//新增商品顏色
router.post('/api/admin/color', authenticated, authenticatedAdmin, adminController.postColor)
//新增商品尺寸
router.post('/api/admin/size', authenticated, authenticatedAdmin, adminController.postSize)
//新增運送方式
router.post('/api/admin/method', authenticated, authenticatedAdmin, adminController.postMethod)

//item
//取得所有商品
router.get('/api/items',itemController.getItems)
//取得單筆商品
router.get('/api/items/:id',itemController.getItem)


//cart
//取得購物車
router.get('/api/carts', authenticated, authenticatedUser, cartController.getCarts)
//新增購物車
router.post('/api/carts/:id', authenticated, authenticatedUser, cartController.addToCart)
//刪除購物車
router.delete('/api/carts/:id', authenticated, authenticatedUser, cartController.delCart)
//刪除所有購物車
router.delete('/api/carts', authenticated, authenticatedUser, cartController.delCarts)




module.exports = router