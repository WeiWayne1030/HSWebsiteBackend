if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const cors = require('cors')

const routes = require('./routes')

const { client, connectRedis } = require('./services/redisClient');

(async () => {
  await connectRedis();   // 🔴 一定要這行
})();


const app = express()
const port = process.env.PORT || 3000


app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(bodyParser.json())

app.use((req, res, next) => {
  req.redisClient = client;
  next();
});


app.use(routes)
app.listen(port, () => console.log(`This server is listening on port ${port}!`))

module.exports = app
