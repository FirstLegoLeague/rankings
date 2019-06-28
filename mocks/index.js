
const express = require('express')

const { stage, teams, scores } = require('./data')

const tournomentApp = express()
const scoringApp = express()

tournomentApp.get('/team/all', (req, res) => {
  res.json(teams)
})

tournomentApp.get('/settings/tournamentStage', (req, res) => {
  res.json(stage)
})

scoringApp.get('/scores/public', (req, res) => {
  res.json(scores)
})

tournomentApp.listen(process.env.PORT || 3001)
scoringApp.listen(process.env.PORT || 3002)
