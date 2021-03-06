const NO_SHOW_KEY = '-'
const FIRST_HIGHER = -1
const SECOND_HIGHER = 1

function compareScores (score1, score2) {
  const SAME = 0
  if (score1 && !score1.noShow) {
    if (score2 && !score2.noShow) {
      return score2.score - score1.score
    } else {
      return FIRST_HIGHER
    }
  } else {
    if (score2 && !score2.noShow) {
      return SECOND_HIGHER
    } else {
      return SAME
    }
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
    if (score.noShow) {
      return NO_SHOW_KEY
    }
    if (this.hideNegatives) {
      return Math.max(score.score, 0)
    }
    return score.score
  }

  static compare (rank1, rank2) {
    if (rank1.scores.length === 0 && rank2.scores.length === 0) {
      return rank1.team.number - rank2.team.number
    }

    if (rank1.scores.every(score => score.noShow)) {
      return SECOND_HIGHER
    }
    if (rank1.scores.every(score => score.noShow)) {
      return FIRST_HIGHER
    }

    for (let i = 0; i < rank1.orderedScores.length && i < rank2.orderedScores.length; i++) {
      const comparison = compareScores(rank1.orderedScores[i], rank2.orderedScores[i])
      if (comparison !== 0) {
        return comparison
      }
    }
    return rank2.orderedScores.length - rank1.orderedScores.length
  }

  static addNumbering (ranks) {
    let lastRank
    let nextNumber = 1
    ranks.forEach(rank => {
      if (rank.orderedScores.length === 0 || rank.orderedScores.every(score => score.noShow)) {
        rank.number = '-'
      } else {
        if (lastRank && Rank.compare(rank, lastRank) === 0) {
          rank.number = lastRank.number
        } else {
          rank.number = nextNumber
        }
        nextNumber++
      }
      lastRank = rank
    })
  }
}

// eslint-disable-next-line node/exports-style
module.exports = function rankings (scores, teams, hideNegatives) {
  const ranks = teams.map(team => new Rank(team, scores, hideNegatives))
    .sort(Rank.compare)

  Rank.addNumbering(ranks)

  return ranks.map(rank => rank.sanitized())
}
