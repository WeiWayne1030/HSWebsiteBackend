const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')
const itemController = require('../controllers/item-controller')
const cartController = require('../controllers/cart-controller')

const { authenticatedUser, authenticated } = require('../middleware/auth')
//const adminController = require('../controllers/admin-controller')

//const { authenticatedAdmin, authenticatedUser, authenticated } = require('../middleware/auth')

// signup & signin
//router.post('/api/admin/signin', adminController.signIn)
router.post('/api/users/signin', userController.signIn)
router.post('/api/users', userController.signUp)

//item
router.get('/api/items',authenticated, authenticatedUser, itemController.getItems)
router.get('/api/items/:id',authenticated, authenticatedUser, itemController.getItem)
router.post('/api/cart/:id', authenticated, authenticatedUser, cartController.addToCart)

//order
// router.post('/api/order', authenticated, authenticatedUser, userController.postOder)

//cart
//router.put('/api/cart/:id', authenticated, authenticatedUser, userController.putCart)
//router.delete('/api/cart/:id', authenticated, authenticatedUser, userController.delCart)
//router.delete('/api/carts', authenticated, authenticatedUser, userController.delCarts)


module.exports = router