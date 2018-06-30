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
    let hideNegatives = Configuration.get('hideNegatives')
    let sanitizedRank = { team: this.team }

    sanitizedRank = this.scores.reduce((rank, score) => {
      rank[score.match] = score.score
      
      if(hideNegatives) {
        rank[score.match] = Math.max(rank[score.match], 0)
      }
      
      return rank
    }, sanitizedRank)

    return sanitizedRank
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

// eslint-disable-next-line node/exports-style
module.exports = function rankings (scores, teams) {
  return teams.map(team => new Rank(team, scores))
    .sort(Rank.compare).map(rank => rank.sanitized())
}
