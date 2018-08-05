'use strict'
/* eslint node/no-unsupported-features: 0 */

const express = require('express')
const Promise = require('bluebird')
require('express-csv')

const rankings = require('./rankings')

const { Resource } = require('./resource')

const router = express.Router()

const Stage = new Resource({
  name: 'stage',
  url: `${process.env.MODULE_TOURNAMENT_URL}/settings/tournamentLevel`,
  trigger: 'stage:updated',
  dataInMessage: true
})

const Teams = new Resource({
  name: 'teams',
  url: `${process.env.MODULE_TOURNAMENT_URL}/team/all`,
  trigger: 'teams:reload',
  dataInMessage: false
})

const Scores = new Resource({
  name: 'scores',
  url: `${process.env.MODULE_SCORING_URL}/scores/all`,
  trigger: 'scores:reload',
  dataInMessage: false
})

function getRankings () {
  return Promise.all([Stage.get(), Scores.get(), Teams.get()])
    .then(responses => {
      const stage = responses[0].toLowerCase()
      const scores = responses[1].filter(score => score.published && score.stage.toLowerCase() === stage)
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
