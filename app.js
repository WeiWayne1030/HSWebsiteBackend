if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const cors = require('cors')
const redis = require('redis'); // 引入Redis包
const bodyParser = require('body-parser')

const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'


// 创建Redis客户端连接
const redisClient = redis.createClient({
  host: 'localhost', // Redis服务器的主机地址
  port: process.env.PORT || 6739,        // Redis服务器的端口号
});


app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(bodyParser.json())

// 在路由中引入Redis客户端
app.use((req, res, next) => {
  req.redisClient = redisClient;
  next();
});


app.use(routes)
app.listen(port, () => console.log(`This server is listening on port ${port}!`))

module.exports = app
