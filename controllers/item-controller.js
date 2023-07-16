const itemServices = require('../services/item-services')

const itemController = {
  getItems: (req, res, next) => {
      itemServices.getItems(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getItem: (req, res, next) => {
      itemServices.getItem(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}
module.exports = itemController