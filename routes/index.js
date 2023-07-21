const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')

const userController = require('../controllers/user-controller')
const itemController = require('../controllers/item-controller')
const cartController = require('../controllers/cart-controller')
const adminController = require('../controllers/admin-controller')

const { authenticatedAdmin, authenticatedUser, authenticated } = require('../middleware/auth')

// signup & signin
router.post('/api/admin/signIn', adminController.signIn)
router.post('/api/users/signIn', userController.signIn)
router.post('/api/users', userController.signUp)

//user
router.get('/api/users/:id/profile', authenticated, authenticatedUser, userController.getUser)
router.put('/api/users/:id/profile',upload.single('image'), authenticated, authenticatedUser, userController.putUser)
//order
router.post('/api/order', authenticated, authenticatedUser, userController.pay)
router.put('/api/orders/:orderId', authenticated, authenticatedUser, userController.editOrder)


//admin
router.post('/api/admin/stock/:id/remove', authenticated, authenticatedAdmin, adminController.removeItem)
router.post('/api/admin/item',upload.single('image'), authenticated, authenticatedAdmin, adminController.postItem)
router.post('/api/admin/items/:stockId', authenticated, authenticatedAdmin, adminController.postStock)
router.delete('/api/admin/stock/:id', authenticated, authenticatedAdmin, adminController.delItem)
router.get('/api/admin/getAdminStock', authenticated, authenticatedAdmin, adminController.getAdminItems)
router.put('/api/admin/stock/:id',upload.single('image'), authenticated, authenticatedAdmin, adminController.putStock)
//admin order
router.get('/api/admin/orders', authenticated, authenticatedAdmin, adminController.getOrders)
router.get('/api/admin/orders/:orderId', authenticated, authenticatedAdmin, adminController.getOrder)
//admin etc
router.post('/api/admin/category', authenticated, authenticatedAdmin, adminController.postCategory)
router.post('/api/admin/color', authenticated, authenticatedAdmin, adminController.postColor)
router.post('/api/admin/size', authenticated, authenticatedAdmin, adminController.postSize)
router.post('/api/admin/method', authenticated, authenticatedAdmin, adminController.postMethod)

//item
router.get('/api/items',authenticated, authenticatedUser, itemController.getItems)
router.get('/api/items/:id',authenticated, authenticatedUser, itemController.getItem)


//cart
router.get('/api/carts', authenticated, authenticatedUser, cartController.getCarts)
router.post('/api/carts/:id', authenticated, authenticatedUser, cartController.addToCart)
router.delete('/api/carts/:id', authenticated, authenticatedUser, cartController.delCart)
router.delete('/api/carts', authenticated, authenticatedUser, cartController.delCarts)




module.exports = router