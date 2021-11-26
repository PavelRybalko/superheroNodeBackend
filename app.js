const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const logger = require('morgan')
const { jsonLimit } = require('./config/rate-limit.json')
const { HttpCode } = require('./helpers/constants')
require('dotenv').config()

const heroesRouter = require('./routes/api/heroes')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'
app.get('env') !== 'test' && app.use(logger(formatsLogger))

app.use(
  cors({
    credentials: true,
    origin:
      process.env.NODE_ENV === 'development'
        ? process.env.BASE_URL
        : process.env.CLIENT_URL,
  })
)
app.use(helmet())
app.use(express.json({ limit: jsonLimit, extended: true }))
app.use('/api/heroes', heroesRouter)

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).json({ message: 'Not found' })
})

app.use((err, _req, res, _next) => {
  res
    .status(err.status || HttpCode.INTERNAL_SERVER_ERROR)
    .json({ message: err.message })
})

module.exports = app
