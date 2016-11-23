const lineupModel = require('../model/lineup')
const matchModel = require('../model/match')
const clubModel = require('../model/club')


// lineupModel.selectUser(18)
//   .then(stats => {

//     const playedStats = stats.filter(stat => {
//       //sub으로 등록되었지만 recordName null인것은 'in'으로 들어가지 않은것이다.
//       return (stat.status == 'sub' && stat.recordName == null) ? false : true
//     })

//     const playedMatches = playedStats.reduce((prev, next) => {
//       // console.log('preve', prev)
//       if(!prev.length) {
//         prev.push(new Array(next))
//         return prev
//       }

//       const prevArr = prev[prev.length - 1]
//       if (prevArr[0].matchId == next.matchId) {
//         prevArr.push(next)
//         return prev
//       }else {
//         prev.push(new Array(next))
//         return prev
//       }

//     }, new Array())

//     console.log('playedMatches  : ', playedMatches)

//   })


exports.getUser = (req, res) => {
  console.time('stats')
  lineupModel.selectUser(req.params.userId)
  .then(stats => {

    console.timeEnd('stats')
    return res.json({
      message: 'success',
      stats: stats
    })
  })
}

exports.getLeagueRank = (req, res) => {

  clubModel.selectExceptTemp(req.params.leagueId)
  .then(clubs => {

    return Promise.all(clubs.map(club => {
      return matchModel.selectClubFixture(req.params.leagueId, club.clubId)
      .then(fixture => {
        return {
          clubName: club.teamName,
          clubId: club.clubId,
          fixture: fixture
        }
      })
    }))
  })
  .then(clubs => {

    clubs = clubs.map(club => {

      const stat = {
        played: club.fixture.length,
        points: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        for: 0,
        against: 0
      }

      club.fixture.forEach(match => {

        if(match.homeScore > match.awayScore) {
          if(match.homeClubId == club.clubId) {
            //home
            stat.won++
            stat.points += 3
            stat.for += match.homeScore
            stat.against += match.awayScore
          }else {
            //away
            stat.lost++
            stat.for += match.awayScore
            stat.against += match.homeScore
          }
        }

        //drawn
        if((!match.homeGiveup && !match.awayGiveup) || (match.homeGiveup && match.awayGiveup)) {
          if(match.homeScore == match.awayScore) {
            stat.drawn++
            stat.points += 1
            stat.for += match.homeScore
            stat.against += match.awayScore
          }
        }

        if(match.homeScore < match.awayScore) {
          if(match.homeClubId == club.clubId) {
            //home
            stat.lost++
            stat.for += match.homeScore
            stat.against += match.awayScore
          }else {
            //away
            stat.won++
            stat.points += 3
            stat.for += match.awayScore
            stat.against += match.homeScore
          }
        }
      })

      stat.different = stat.for - stat.against
      club.stat = stat

      return club
    })

    clubs.sort((prev, next) => {
      return prev.stat.points < next.stat.points
    })
    return res.json({
      message: 'success',
      ranks: clubs
    })
  })
}