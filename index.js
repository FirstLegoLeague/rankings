const DEFAULT_PORT = 3002

const express = require('express')
const cors = require('cors')

const { correlationMiddleware } = require('@first-lego-league/ms-correlation')
const { Logger, loggerMiddleware } = require('@first-lego-league/ms-logger')

const { version: projectVersion } = require('./package.json')
const { rankingsRouter } = require('./lib/rankings_router')

const port = process.env.PORT || DEFAULT_PORT

const app = express()
const logger = new Logger()
logger.info(`-------------------- rankings version ${projectVersion} startup --------------------`)

app.use(correlationMiddleware)
app.use(loggerMiddleware)
app.use(cors())

app.use(rankingsRouter)

app.listen(port, () => {
  logger.info(`Rankings service listening on port ${port}`)
})

process.on('SIGINT', () => {
  logger.info('Process received SIGINT: shutting down')
  process.exit(130)
})

process.on('uncaughtException', err => {
  logger.fatal(err.message)
  process.exit(1)
})

process.on('unhandledRejection', err => {
  logger.fatal(err.message)
  process.exit(1)
})
