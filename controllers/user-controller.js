const userServices = require('../services/user-services')
//const upload = require('../middleware/multer')

const userController = {
  signIn: (req, res, next) => {
      userServices.signIn(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  signUp: (req, res, next) => {
      userServices.signUp(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getUser: (req, res, next) => {
      userServices.getUser(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  putUser: (req, res, next) => {
      userServices.putUser(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  pay: (req, res, next) => {
      userServices.pay(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  editOrder: (req, res, next) => {
      userServices.editOrder(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}
module.exports = userController