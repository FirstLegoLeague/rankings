'use strict'

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
  constructor (team, scores, hideNegatives) {
    this.hideNegatives = hideNegatives
    this.team = team
    this.scores = scores
      .filter(score => score.teamNumber === team.number)
    this.orderedScores = this.scores.slice()
      .sort(compareScores)
  }

  sanitized () {
    return {
      team: this.team,
      rank: this.number,
      scores: this.scores
        .reduce((arr, score) => {
          arr[score.round - 1] = score
          return arr
        }, [])
        .map(score => this.sanitizedScore(score)),
      highest: this.orderedScores.length ? this.sanitizedScore(this.orderedScores[0]) : undefined
    }
  }

  sanitizedScore (score) {
    return this.hideNegatives ? Math.max(score.score, 0) : score.score
  }
}

Rank.compare = function (rank1, rank2) {
  if (rank1.orderedScores.length === 0 && rank2.orderedScores.length === 0) {
    return rank1.team.number - rank2.team.number
  }
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
    if (lastRank && Rank.compare(rank, lastRank) !== 0 &&
      rank.orderedScores.length !== 0 && lastRank.orderedScores.length !== 0) {
      currentNumber++
    }
    if (rank.orderedScores.length !== 0) {
      rank.number = currentNumber
    } else {
      rank.number = '-'
    }
    lastRank = rank
  })
}

// eslint-disable-next-line node/exports-style
module.exports = function rankings (scores, teams, hideNegatives) {
  const ranks = teams.map(team => new Rank(team, scores, hideNegatives))
    .sort(Rank.compare)

  Rank.addNumbering(ranks)

  return ranks.map(rank => rank.sanitized())
}
