'use strict'

const express = require('express')

const router = express.Router()

const TEAMS = [
  { number: 1, name: 'The first team' },
  { number: 2, name: 'Two is always together' },
  { number: 8, name: 'Magic 8' },
  { number: 15, name: 'The RoboJars' },
  { number: 54, name: 'What will you get if you multiply six by nine?' },
  { number: 123, name: 'Genesis' },
  { number: 132, name: 'King of Hearts' },
  { number: 173, name: 'The Society of the Blind Eye' },
  { number: 182, name: 'The blue dot' },
  { number: 534, name: 'The Fellowship of the Ring' },
  { number: 856, name: 'The Order of the Phoenix' },
  { number: 956, name: 'ElectroWreckers' },
  { number: 981, name: 'The Green slime club' },
  { number: 2212, name: 'The Spikes' },
  { number: 8846, name: 'Syntax error' }
]

const SCORES = [
  { teamNumber: 1, match: 'Practice #1', score: 55 },
  { teamNumber: 2, match: 'Practice #1', score: 426 },
  { teamNumber: 8, match: 'Practice #1', score: 356 },
  { teamNumber: 15, match: 'Practice #1', score: 240 },
  { teamNumber: 54, match: 'Practice #1', score: 125 },
  { teamNumber: 123, match: 'Practice #1', score: 256 },
  { teamNumber: 132, match: 'Practice #1', score: 240 },
  { teamNumber: 173, match: 'Practice #1', score: 523 },
  { teamNumber: 182, match: 'Practice #1', score: 423 },
  { teamNumber: 534, match: 'Practice #1', score: 465 },
  { teamNumber: 856, match: 'Practice #1', score: 245 },
  { teamNumber: 956, match: 'Practice #1', score: 156 },
  { teamNumber: 981, match: 'Practice #1', score: 236 },
  { teamNumber: 2212, match: 'Practice #1', score: 74 },
  { teamNumber: 8846, match: 'Practice #1', score: 85 },

  { teamNumber: 1, match: 'Qualifications #1', score: 50 },
  { teamNumber: 2, match: 'Qualifications #1', score: 182 },
  { teamNumber: 8, match: 'Qualifications #1', score: 165 },
  { teamNumber: 15, match: 'Qualifications #1', score: 432 },
  { teamNumber: 54, match: 'Qualifications #1', score: 162 },
  { teamNumber: 123, match: 'Qualifications #1', score: 315 },
  { teamNumber: 132, match: 'Qualifications #1', score: 152 },
  { teamNumber: 173, match: 'Qualifications #1', score: 20 },
  { teamNumber: 182, match: 'Qualifications #1', score: 24 },
  { teamNumber: 534, match: 'Qualifications #1', score: 56 },
  { teamNumber: 856, match: 'Qualifications #1', score: 75 },
  { teamNumber: 956, match: 'Qualifications #1', score: 145 },
  { teamNumber: 981, match: 'Qualifications #1', score: 245 },
  { teamNumber: 2212, match: 'Qualifications #1', score: 345 },
  { teamNumber: 8846, match: 'Qualifications #1', score: 465 },

  { teamNumber: 1, match: 'Qualifications #2', score: 195 },
  { teamNumber: 2, match: 'Qualifications #2', score: 375 },
  { teamNumber: 8, match: 'Qualifications #2', score: 364 },
  { teamNumber: 15, match: 'Qualifications #2', score: 195 },
  { teamNumber: 54, match: 'Qualifications #2', score: 255 },
  { teamNumber: 123, match: 'Qualifications #2', score: 153 },
  { teamNumber: 132, match: 'Qualifications #2', score: 42 },
  { teamNumber: 173, match: 'Qualifications #2', score: 245 },
  { teamNumber: 182, match: 'Qualifications #2', score: 385 },
  { teamNumber: 534, match: 'Qualifications #2', score: 45 },
  { teamNumber: 856, match: 'Qualifications #2', score: 85 },
  { teamNumber: 956, match: 'Qualifications #2', score: 235 },
  { teamNumber: 981, match: 'Qualifications #2', score: 75 },
  { teamNumber: 2212, match: 'Qualifications #2', score: 44 },
  { teamNumber: 8846, match: 'Qualifications #2', score: 85 },

  { teamNumber: 1, match: 'Qualifications #3', score: 125 },
  { teamNumber: 2, match: 'Qualifications #3', score: 56 },
  { teamNumber: 8, match: 'Qualifications #3', score: 405 },
  { teamNumber: 15, match: 'Qualifications #3', score: 455 },
  { teamNumber: 54, match: 'Qualifications #3', score: 35 },
  { teamNumber: 123, match: 'Qualifications #3', score: 145 },
  { teamNumber: 132, match: 'Qualifications #3', score: 255 },
  { teamNumber: 173, match: 'Qualifications #3', score: 275 },
  { teamNumber: 182, match: 'Qualifications #3', score: 135 },
  { teamNumber: 534, match: 'Qualifications #3', score: 285 },
  { teamNumber: 856, match: 'Qualifications #3', score: 95 },
  { teamNumber: 956, match: 'Qualifications #3', score: 35 },
  { teamNumber: 981, match: 'Qualifications #3', score: 45 },
  { teamNumber: 2212, match: 'Qualifications #3', score: 250 },
  { teamNumber: 8846, match: 'Qualifications #3', score: 350 }
]

router.use('/team/all', (req, res) => {
  res.json(TEAMS)
})

router.use('/scores/all', (req, res) => {
  res.json(SCORES)
})

// eslint-disable-next-line node/exports-style
module.exports = router
