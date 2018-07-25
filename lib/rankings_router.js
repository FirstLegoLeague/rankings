'use strict'

const express = require('express')
const axios = require('axios')
const Promise = require('bluebird')
require('express-csv')

const rankings = require('./rankings')

const router = express.Router()

const URLS = {
  stage: `${process.env.MODULE_TOURNAMENT_URL}/settings/tournamentLevel`,
  scores: `${process.env.MODULE_SCORING_URL}/scores/all`,
  teams: `${process.env.MODULE_TOURNAMENT_URL}/teams/all`
}

function load (key) {
  if (process.env.DEV) {
    // eslint-disable-next-line import/no-dynamic-require
    return Promise.resolve(require(`./dev/${key}`))
  } else {
    return axios.get(URLS[key])
  }
}

function getRankings () {
  return Promise.all([load('stage'), load('scores'), load('teams')])
    .then(responses => {
      const stage = responses[0].toLowerCase()
      const scores = responses[1].filter(score => score.published && score.match.toLowerCase().includes(stage))
      const teams = responses[2]
      return rankings(scores, teams)
    })
}

router.use('/rankings.json', (req, res) => {
  getRankings().then(ranks => {
    res.json(ranks)
  }).catch(() => {
    res.status(500).send('Could not load scores')
  })
})

router.use('/rankings.csv', (req, res) => {
  getRankings().then(ranks => {
    const headers = ['rank', 'team', 'highest']
      .concat(ranks[0].scores.map((score, index) => index + 1))
    const csv = [headers]
      .concat(ranks.map(rank => [ rank.rank, rank.team.number, rank.highest ]
        .concat(rank.scores)))
    res.csv(csv)
  }).catch(() => {
    res.status(500).send('Could not load scores')
  })
})

// eslint-disable-next-line node/exports-style
module.exports = router
