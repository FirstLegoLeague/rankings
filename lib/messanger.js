'use strict'
/* eslint node/no-unsupported-features: 0 */

const MHubClient = require('mhub').MClient
const logger = require('@first-lego-league/ms-logger').Logger()
const { getCorrelationId } = require('@first-lego-league/ms-correlation')

const MHUB_CLIENT_ID = 'cl-rankings'
const RETRY_TIMEOUT = 10 * 1000 // 10 seconds

const client = new MHubClient(process.env.MHUB_URI)

let connectionPromise = null

function retryConnection () {
  connectionPromise = null
  logger.warn('Disconnected from mhub')
  setTimeout(() => {
    log.info('Retrying mhub connection')
    connect()
  }, RETRY_TIMEOUT)
}

client.on('error', msg => {
  logger.error('Unable to connect to mhub, other modules won\'t be notified changes \n ' + msg)
})

client.on('close', () => {
  retryConnection()
})

function connect () {
  if (!connectionPromise) {
    connectionPromise = client.connect()
      .then(() => client.login('protected-client', process.env.PROTECTED_MHUB_PASSWORD))
      .catch(() => retryConnection())
  }
  return connectionPromise
}

exports.listen = function (topic, listener) {
  client.on('message', message => listener(message.data, message))

  const node = (process.env.DEV === 'true') ? 'default' : 'protected'
  return connect().then(() => client.subscribe(node, topic))
}

exports.send = function (topic, data = {}) {
  return connect()
    .then(() => client.publish('protected', topic, data, {
      'client-id': MHUB_CLIENT_ID,
      'correlation-id': getCorrelationId()
    }))
}
