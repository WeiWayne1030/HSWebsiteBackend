const adminServices = require('../services/admin-services')
const { Item, Stock, Color, Size, Order, User } = require('../models')
const helpers = require('../_helpers')

const adminController = {
   signIn: (req, res, next) => {
      adminServices.signIn(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getItems: (req, res, next) => {
      adminServices.getItems(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getStocks: (req, res, next) => {
      adminServices.getStocks(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
   delItem: (req, res, next) => {
      adminServices.delItem(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  removeItem: (req, res, next) => {
      adminServices.removeItem(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  relistItem: (req, res, next) => {
      adminServices.relistItem(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  postItem: (req, res, next) => {
      adminServices.postItem(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  // postStock: (req, res, next) => {
  //     adminServices.postStock(req, (err, data) => err ? next(err) : res.status(200).json(data))
  // },
  getOrders: (req, res, next) => {
    adminServices.getOrders(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  // getOrderInfo: (req, res, next) => {
  //   adminServices.getOrderInfo(req, (err, data) => err ? next(err) : res.status(200).json(data))
  // },
  putStock: (req, res, next) => {
    adminServices.putStock(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  postCategory: (req, res, next) => {
    adminServices.postCategory(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getCategories: (req, res, next) => {
    adminServices.getCategories(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  putCategory: (req, res, next) => {
    adminServices.putCategory(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  removeCategory: (req, res, next) => {
    adminServices.removeCategory(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  postColor: (req, res, next) => {
    adminServices.postColor(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  postSize: (req, res, next) => {
    adminServices.postSize(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  postMethod: (req, res, next) => {
    adminServices.postMethod(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  // slGetOrderInfos: (req, res, next) => {
  //   adminServices.slGetOrderInfos(req, (err, data) => err ? next(err) : res.status(200).json(data))
  // },
  // slGetOrderInfo: (req, res, next) => {
  //   adminServices.slGetOrderInfo(req, (err, data) => err ? next(err) : res.status(200).json(data))
  // }
  
}

module.exports = adminController