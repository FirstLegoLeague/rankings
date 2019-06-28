const axios = require('axios')
const Promise = require('bluebird')
const { Logger } = require('@first-lego-league/ms-logger')

const { teams } = require('./dev/teams')
const { stage } = require('./dev/stage')
const { scores } = require('./dev/scores')

const Messanger = require('./messanger')

if (process.env.NODE_ENV === 'development') {
  exports.Resource = function ({ name }) {
    const data = { teams, stage, scores }[name]
    this.get = () => data
  }
} else {
  const EXPIRATION_TIME = 30 * 60 * 1000 // Half an hour

  exports.Resource = class Resource {
    constructor ({ url, topic, dataInMessage, name }) {
      this.url = url
      this.topic = topic
      this.dataInMessage = dataInMessage
      this.name = name
      this.logger = new Logger()
      this.init()
    }

    init () {
      if (!this._initPromise || (Date.now() - this._timestamp > EXPIRATION_TIME)) {
        this._timestamp = Date.now()
        this._initPromise = Messanger.listen(this.topic, data => {
          (this.dataInMessage ? Promise.resolve(data.value) : this.reload())
            .then(value => {
              this.value = value
              return Messanger.send('rankings:reload', { resource: this.name })
            })
            .catch(() => {
              this._initPromise = null
            })
          return this
        }).then(() => this.reload())
          .then(value => { this.value = value })
          .catch(err => {
            this._initPromise = null
            throw err
          })
      }
      return this._initPromise
    }

    reload () {
      this.logger.info(`Reloading ${this.name}`)
      return axios.get(this.url)
        .then(response => response.data)
    }

    get () {
      return this.init().then(() => this.value)
    }
  }
}
