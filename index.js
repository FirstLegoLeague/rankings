'use strict'
/* eslint node/no-deprecated-api: 0 */
/* eslint node/no-unsupported-features: 0 */

const DEFAULT_PORT = 3002

const express = require('express')
const domain = require('domain')
const cors = require('cors')

const { correlationMiddleware, correlateSession } = require('@first-lego-league/ms-correlation')
const { Logger, loggerMiddleware } = require('@first-lego-league/ms-logger')

const rankingsRouter = require('./lib/rankings_router')

const port = process.env.PORT || DEFAULT_PORT

const app = express()
const logger = new Logger()

app.use(correlationMiddleware)
app.use(loggerMiddleware)
app.use(cors())

app.use('rankings', rankingsRouter)

if (process.env.DEV) {
  app.use(require('./lib/dev_router'))
}

app.listen(port, () => {
  domain.create().run(() => {
    correlateSession()
    logger.info(`Scoring service listening on port ${port}`)
  })
})
