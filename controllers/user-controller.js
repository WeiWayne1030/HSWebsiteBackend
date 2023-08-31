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
//   orderInfo: (req, res, next) => {
//       userServices.orderInfo(req, (err, data) => err ? next(err) : res.status(200).json(data))
//   },
  buildOrder: (req, res, next) => {
      userServices.buildOrder(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
//     putOrderInfo: (req, res, next) => {
//         userServices.putOrderInfo(req, (err, data) => err ? next(err) : res.status(200).json(data))
//   },
  getOrders: (req, res, next) => {
        userServices.getOrders(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
//   getOrder: (req, res, next) => {
//         userServices.getOrder(req, (err, data) => err ? next(err) : res.status(200).json(data))
//   }
}
module.exports = userController