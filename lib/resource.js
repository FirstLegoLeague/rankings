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
    constructor ({ url, trigger, dataInMessage, name }) {
      this.url = url
      this.trigger = trigger
      this.dataInMessage = dataInMessage
      this.name = name

      this.init()
    }

    init () {
      if (!this._initPromise || (Date.now() - this._timestamp > EXPIRATION_TIME)) {
        this._timestamp = Date.now()
        this._initPromise = Messanger.listen(this.trigger, data => {
          if (this.dataInMessage) {
            this.value = data.value
          } else {
            this.reload()
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
