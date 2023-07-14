const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')
//const adminController = require('../controllers/admin-controller')

//const { authenticatedAdmin, authenticatedUser, authenticated } = require('../middleware/auth')

// signup & signin
//router.post('/api/admin/signin', adminController.signIn)
router.post('/api/users/signin', userController.signIn)
router.post('/api/users', userController.signUp)

module.exports = router