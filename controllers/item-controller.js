const itemServices = require('../services/user-services')

const itemController = {
  getItems: (req, res, next) => {
      userServices.getItems(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}
module.exports = itemController