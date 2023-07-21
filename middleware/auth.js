const helpers = require('../_helpers')
const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return res.json({ status: 'error', message: 'Unauthorized' })
    }
<<<<<<< HEAD
    req.user = user
=======
    req.user = user // 把user結果存起來
>>>>>>> 78ba64403d9cd869e89b70947594f13e8f3a6409
    return next()
  })(req, res, next)
}
const authenticatedUser = (req, res, next) => {
  if (helpers.getUser(req) && helpers.getUser(req).role === 'buyer') return next()
  return res.status(403).json({ status: 'error', message: '帳號不存在！' })
}
<<<<<<< HEAD
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req) && helpers.getUser(req).role === 'seller') return next()
  return res.status(403).json({ status: 'error', message: '帳號不存在！' })
}

module.exports = {
  authenticatedUser,
  authenticated,
  authenticatedAdmin
=======

module.exports = {
  authenticatedUser,
  authenticated
>>>>>>> 78ba64403d9cd869e89b70947594f13e8f3a6409
}