'use strict'

const express = require('express')
const axios = require('axios')
const Promise = require('bluebird')

const rankings = require('./rankings')

const router = express.Router()

router.use('/:stage', (req, res) => {
  const stageRegex = new RegExp(req.params.stage)
  Promise.all([axios.get(`${process.env.MODULE_SCORING_URL}/scores/all`), axios.get(`${process.env.MODULE_TOURNAMENT_URL}/teams/all`)])
    .then(responses => {
      const scores = responses[0].filter(score => score.stage.match(stageRegex))
      const teams = responses[1]
      res.json(rankings(scores, teams))
    }).catch(() => {
      res.send('Could not load scores').status(500)
    })
})

// eslint-disable-next-line node/exports-style
module.exports = router
