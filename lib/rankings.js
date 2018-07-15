'use strict'

const Configuration = require('@first-lego-league/ms-configuration')

function compareScores (score1, score2) {
  if (score1 && !score2) {
    return score1
  } else if (score2 && !score1) {
    return score2
  } else {
    return score2.score - score1.score
  }
}

class Rank {
  constructor (team, scores) {
    this.team = team
    this.scores = scores
      .filter(score => score.teamNumber === team.number)
    this.orderedScores = this.scores
      .sort(compareScores)
  }

  sanitized () {
    const hideNegatives = Configuration.get('hideNegatives')

    return {
      team: this.team,
      rank: this.number,
      scores: this.scores.map(score => hideNegatives ? Math.max(score.score, 0) : score.score),
      highest: this.orderedScores[0].score
    }
  }
}

Rank.compare = function (rank1, rank2) {
  for (let i = 0; i < rank1.orderedScores.length && i < rank2.orderedScores.length; i++) {
    const comparison = compareScores(rank1.orderedScores[i], rank2.orderedScores[i])
    if (comparison !== 0) {
      return comparison
    }
  }
  return rank2.orderedScores.length - rank1.orderedScores.length
}

Rank.addNumbering = function (ranks) {
  let currentNumber = 1
  let lastRank
  ranks.forEach(rank => {
    if (lastRank && Rank.compare(rank, lastRank) !== 0) {
      currentNumber++
    }
    rank.number = currentNumber
    lastRank = rank
  })
}

// eslint-disable-next-line node/exports-style
module.exports = function rankings (scores, teams) {
  const ranks = teams.map(team => new Rank(team, scores))
    .sort(Rank.compare)

  Rank.addNumbering(ranks)

  return ranks.map(rank => rank.sanitized())
}
