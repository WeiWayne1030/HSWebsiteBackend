const adminServices = require('../services/admin-services')
const { Item, Stock, Color, Size, Order, User } = require('../models')
const helpers = require('../_helpers')

const adminController = {
   signIn: (req, res, next) => {
      adminServices.signIn(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },

  //商品
  getItems: (req, res, next) => {
      adminServices.getItems(req, (err, data) => err ? next(err) : res.status(200).json(data))
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

  //庫存
    getStocks: (req, res, next) => {
      adminServices.getStocks(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  // postStock: (req, res, next) => {
  //     adminServices.postStock(req, (err, data) => err ? next(err) : res.status(200).json(data))
  // },
  // putStock: (req, res, next) => {
  //   adminServices.putStock(req, (err, data) => err ? next(err) : res.status(200).json(data))
  // },
  putStockNumber: (req, res, next) => {
    adminServices.putStockNumber(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  addStock: (req, res, next) => {
    adminServices.addStock(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },

  //訂單
  getOrders: (req, res, next) => {
    adminServices.getOrders(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getOrderItems: (req, res, next) => {
    adminServices.getOrderItems(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },

  //種類
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
  relistCategory: (req, res, next) => {
    adminServices.relistCategory(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  delCategory: (req, res, next) => {
    adminServices.delCategory(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },

  //顏色
  postColor: (req, res, next) => {
    adminServices.postColor(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getColors: (req, res, next) => {
    adminServices.getColors(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  // removeColor: (req, res, next) => {
  //   adminServices.removeColor(req, (err, data) => err ? next(err) : res.status(200).json(data))
  // },
  // relistColor: (req, res, next) => {
  //   adminServices.relistColor(req, (err, data) => err ? next(err) : res.status(200).json(data))
  // },
  delColor: (req, res, next) => {
    adminServices.delColor(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },

  //尺寸
  postSize: (req, res, next) => {
    adminServices.postSize(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getSizes: (req, res, next) => {
    adminServices.getSizes(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  putSize: (req, res, next) => {
    adminServices.putSize(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  removeSize: (req, res, next) => {
    adminServices.removeSize(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  relistSize: (req, res, next) => {
    adminServices.relistSize(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  delSize: (req, res, next) => {
    adminServices.delSize(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },

  //付款方式
  postMethod: (req, res, next) => {
    adminServices.postMethod(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
   getMethods: (req, res, next) => {
    adminServices.getMethods(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  putMethod: (req, res, next) => {
    adminServices.putMethod(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  removeMethod: (req, res, next) => {
    adminServices.removeMethod(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  relistMethod: (req, res, next) => {
    adminServices.relistMethod(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  delMethod: (req, res, next) => {
    adminServices.delMethod(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },





  // slGetOrderInfos: (req, res, next) => {
  //   adminServices.slGetOrderInfos(req, (err, data) => err ? next(err) : res.status(200).json(data))
  // },
  // slGetOrderInfo: (req, res, next) => {
  //   adminServices.slGetOrderInfo(req, (err, data) => err ? next(err) : res.status(200).json(data))
  // }
  
}

module.exports = adminController