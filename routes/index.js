const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')

const userController = require('../controllers/user-controller')
const itemController = require('../controllers/item-controller')
const cartController = require('../controllers/cart-controller')
const adminController = require('../controllers/admin-controller')

const { authenticatedAdmin, authenticatedUser, authenticated } = require('../middleware/auth')




// signup & signin
//商家登入 ok
router.post('/api/admin/signin', adminController.signIn)
//使用者登入 ok
router.post('/api/users/signin', userController.signIn)
//使用者註冊
router.post('/api/users', userController.signUp)

//user
//使用者資料
router.get('/api/users/:id/profile', authenticated, authenticatedUser, userController.getUser)
//修改使用者資料
router.put('/api/users/:id/profile',upload.single('image'), authenticated, authenticatedUser, userController.putUser)





//order
//建立訂單
router.post('/api/orders', authenticated, authenticatedUser, userController.buildOrder)
// //修改訂單資料（付款資料部分）
// router.put('/api/orderInfos/:InfoId', authenticated, authenticatedUser, userController.putOrderInfo)
// //取得該使用者單筆訂單資料
// router.get('/api/orders/:id', authenticated, authenticatedUser, userController.getOrder)
//取得該使用者所有訂單資料
router.get('/api/orders', authenticated, authenticatedUser, userController.getOrders)

//admin（庫存管理）
//下架商品
router.post('/api/admin/items/:id/remove', authenticated, authenticatedAdmin, adminController.removeItem);
//重新上架商品
router.post('/api/admin/items/:id/relist', authenticated, authenticatedAdmin, adminController.relistItem);
//新增商品
router.post('/api/admin/items',upload.single('image'), authenticated, authenticatedAdmin, adminController.postItem)

// //刪除商品庫存(為確保已生成訂單的紀錄，所以暫不使用此功能)
// router.delete('/api/admin/items/:id', authenticated, authenticatedAdmin, adminController.delItem)



// //新增商品庫存
// router.post('/api/admin/items/:stockId', authenticated, authenticatedAdmin, adminController.postStock)
// //修改商品庫存
// router.put('/api/admin/stock/:id',upload.single('image'), authenticated, authenticatedAdmin, adminController.putStock)
//檢視所有庫存
router.get('/api/admin/stocks', authenticated, authenticatedAdmin, adminController.getStocks)
//檢視所有商品（上架下架）
router.get('/api/admin/items', authenticated, authenticatedAdmin, adminController.getItems)




//admin order
// //取得所有訂單資料
router.get('/api/admin/orders', authenticated, authenticatedAdmin, adminController.getOrders)
// //取得單筆訂單資料
// router.get('/api/admin/orderInfos/:id', authenticated, authenticatedAdmin, adminController.slGetOrderInfo)


// //admin etc
//商品

////新增商品分類
router.post('/api/admin/category', authenticated, authenticatedAdmin, adminController.postCategory)
////查詢商品分類
router.get('/api/admin/category', authenticated, authenticatedAdmin, adminController.getCategories)
////修改商品分類
router.put('/api/admin/category/:id', authenticated, authenticatedAdmin, adminController.putCategory)
////取消商品分類
router.post('/api/admin/category/:id/remove', authenticated, authenticatedAdmin, adminController.removeCategory)

//新增商品顏色
router.post('/api/admin/color', authenticated, authenticatedAdmin, adminController.postColor)
//新增商品尺寸
router.post('/api/admin/size', authenticated, authenticatedAdmin, adminController.postSize)
//新增運送方式
router.post('/api/admin/method', authenticated, authenticatedAdmin, adminController.postMethod)

//item
//取得所有商品 ok
router.get('/api/items',itemController.getItems)
//取得單筆商品 ok
router.get('/api/items/:id',itemController.getItem)


//cart
//取得購物車 ok
router.get('/api/carts', authenticated, authenticatedUser, cartController.getCarts)
//新增購物車 ok
router.post('/api/cart', authenticated, authenticatedUser, cartController.addToCart)
//刪除購物車 ok
router.delete('/api/carts/:id', authenticated, authenticatedUser, cartController.delCart)
//刪除所有購物車 未使用
router.delete('/api/cart', authenticated, authenticatedUser, cartController.delCarts)




module.exports = router