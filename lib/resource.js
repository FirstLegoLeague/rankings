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

  class Resource {
    constructor ({ url, trigger, dataInMessage }) {
      this.url = url
      this.trigger = trigger
      this.dataInMessage = dataInMessage

      this.init()
    }

    init () {
      if (!this._initPromise) {
        this._initPromise = Messanger.listen(this.topic, data => {
          if (this.dataInMessage) {
            this.value = data.value
          } else {
            this.reload()
          }
        }).then(this.reload)
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
