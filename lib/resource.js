'use strict'
/* eslint node/no-unsupported-features: 0 */
/* eslint import/no-dynamic-require: 0 */

if (process.env.DEV) {
  exports.Resource = function ({ name }) {
    this.get = () => require(`./dev/${name}`)
  }
} else {
  const axios = require('axios')

  const Messanger = require('./messanger')

  const EXPIRATION_TIME = 30 * 60 * 1000 // Half an hour

  class Resource {
    constructor ({ url, topic, dataInMessage, name }) {
      this.url = url
      this.topic = topic
      this.dataInMessage = dataInMessage
      this.name = name
    }

    init () {
      if (!this._initPromise || (Date.now() - this._timestamp > EXPIRATION_TIME)) {
        this._timestamp = Date.now()
        this._initPromise = Messanger.listen(this.topic, (data, msg) => {
          if (msg.topic !== this.topic) {
            return
          }
          if (this.dataInMessage) {
            this.value = data.value
            Messanger.send('rankings:reload', { resource: this.name })
          } else {
            this.reload()
              .then(() => {
                Messanger.send('rankings:reload', { resource: this.name })
              })
              .catch(() => {
                this._initPromise = null
              })
          }
          return this
        }).then(() => this.reload())
          .catch(err => {
            this._initPromise = null
            throw err
          })
      }
      return this._initPromise
    }

    reload () {
      return axios.get(this.url).then(response => {
        this.value = response.data
      })
    }

    get () {
      return this.init().then(() => this.value)
    }
  }

  exports.Resource = Resource
}
