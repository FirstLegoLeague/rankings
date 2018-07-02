'use strict'

const express = require('express')
const axios = require('axios')
const Promise = require('bluebird')

const rankings = require('./rankings')

const router = express.Router()

function load (collection) {
  if (process.env.DEV) {
    // eslint-disable-next-line import/no-dynamic-require
    return Promise.resolve(require(`./dev/${collection}`))
  } else {
    return axios.get(`${process.env.MODULE_TOURNAMENT_URL}/${collection}/all`)
  }
}

router.use('/:stage', (req, res) => {
  const matchRegex = new RegExp(req.params.stage, 'i')
  Promise.all([load('scores'), load('teams')])
    .then(responses => {
      const scores = responses[0].filter(score => score.published && score.match.match(matchRegex))
      const teams = responses[1]
      if (scores.length === 0) {
        res.send('Found no scores in the required match.').status(400)
      } else {
        res.json(rankings(scores, teams))
      }
    }).catch(() => {
      res.send('Could not load scores').status(500)
    })
})

// eslint-disable-next-line node/exports-style
module.exports = router
