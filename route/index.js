const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')

const upload = require('../middleware/multer')
const { authenticatedAdmin, authenticatedUser, authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

// signup & signin
router.post('/api/admin/signin', adminController.signIn)
router.post('/api/users/signin', userController.signIn)
router.post('/api/users', userController.signUp)

// user
router.put('/api/users/:id', authenticated, authenticatedUser, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), userController.putUser)

router.get('/api/users/:id', authenticated, authenticatedUser, userController.getUser)


router.use('/', generalErrorHandler)

module.exports = router