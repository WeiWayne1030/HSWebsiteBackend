const passport = require('passport')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const { User } = require('../models')

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

const strategy = new JwtStrategy(jwtOptions, function (jwtPayload) {
  User.findOne(jwtPayload.id, function(err, user) {
      if (err) {
          return done(err, false)
      }
      if (user) {
          return done(null, user)
      } else {
          return done(null, false)
      }
  })
})


passport.use(strategy)

module.exports = passport
