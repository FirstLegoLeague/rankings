'use strict'
/* eslint node/no-unsupported-features: 0 */

const express = require('express')
const Promise = require('bluebird')
require('express-csv')

const Configuration = require('@first-lego-league/ms-configuration')

const rankings = require('./rankings')
const { Resource } = require('./resource')

const router = express.Router()

const Stage = new Resource({
  name: 'stage',
  url: `${process.env.MODULE_TOURNAMENT_URL}/settings/tournamentStage`,
  topic: 'tournamentStage:updated',
  dataInMessage: true
})

const Teams = new Resource({
  name: 'teams',
  url: `${process.env.MODULE_TOURNAMENT_URL}/team/all`,
  topic: 'teams:reload',
  dataInMessage: false
})

const Scores = new Resource({
  name: 'scores',
  url: `${process.env.MODULE_SCORING_URL}/scores/all`,
  topic: 'scores:reload',
  dataInMessage: false
})

function getRankings (req) {
  return Promise.all([Stage.get(), Scores.get(), Teams.get(), Configuration.get('hideNegatives')])
    .then(([stageResponse, scroesResponse, teamsResponse, hideNegativesConfiguration]) => {
      const stage = stageResponse.toLowerCase()
      const scores = scroesResponse.filter(score => score.public && score.stage.toLowerCase() === stage)
      const teams = teamsResponse
      const hideNegatives = req.query.hasOwnProperty('hideNegatives') ? JSON.parse(req.query.hideNegatives) : hideNegativesConfiguration

      req.logger.info(`Calculating rankings of ${teams.length} teams with ${scores.length} scores `)
      return rankings(scores, teams, hideNegatives)
    })
}

router.use('/rankings.json', (req, res) => {
  getRankings(req).then(ranks => {
    res.json(ranks)
  }).catch(err => {
    req.logger.error(err)
    res.status(500).send('Could not load scores')
  })
})

router.use('/rankings.csv', (req, res) => {
  getRankings(req).then(ranks => {
    const maxScoresCount = Math.max.apply(null, ranks.map(rank => rank.scores.length))
    const headers = ['rank', 'team', 'highest']
      .concat(Array.from(new Array(maxScoresCount), (val, index) => index + 1))
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
