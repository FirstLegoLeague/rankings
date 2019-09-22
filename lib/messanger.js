const MHubClient = require('mhub').MClient
const { Logger } = require('@first-lego-league/ms-logger')
const Promise = require('bluebird')

const RETRY_TIMEOUT = 10 * 1000 // 10 seconds

const node = 'protected'
const client = new MHubClient(process.env.MHUB_URI)
const logger = new Logger()

client.topics = []

let connectionPromise = null

function retryConnection () {
  connectionPromise = null
  logger.warn('Disconnected from mhub')
  setTimeout(() => {
    logger.info('Retrying mhub connection')
    connect()
      .then(() => Promise.all(client.topics.map(topic => client.subscribe(node, topic))))
      .catch(() => retryConnection())
  }, RETRY_TIMEOUT)
}

client.on('error', err => logger.error(`Unable to connect to mhub, other modules won't be notified changes: ${err}`))

client.on('close', () => {
  retryConnection()
})

function connect () {
  if (!connectionPromise) {
    connectionPromise = client.connect()
      .then(() => client.login('protected-client', process.env.PROTECTED_MHUB_PASSWORD))
      .then(() => logger.info('Connected to mhub'))
      .catch(() => retryConnection())
  }
  return connectionPromise
}

exports.listen = function (topic, listener) {
  client.on('message', message => {
    if (message.topic === topic) {
      listener(message.data, message)
    }
  })

  client.topics.push(topic)

  return connect().then(() => client.subscribe(node, topic))
}

exports.send = function (topic, data = {}) {
  return connect()
    .then(() => client.publish('protected', topic, data))
}
