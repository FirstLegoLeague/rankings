'use strict'

const MHubClient = require('mhub').MClient

exports.listen = function (topic, listener) {
  const client = new MHubClient(process.env.MHUB_URI)

  client.on('message', message => listener(message.data, message))

  const node = (process.env.DEV === 'true') ? 'default' : 'protected'
  return client.connect().then(() => client.subscribe(node, topic))
}
