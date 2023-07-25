if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(bodyParser.json())
const cors = require('cors')
app.use(routes)
app.use(cors())
app.listen(port, () => console.log(`This server is listening on port ${port}!`))

module.exports = app
