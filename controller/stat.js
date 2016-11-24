const lineupModel = require('../model/lineup')
const rankNonModel = require('../model/non/rank')
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

  const leagueId = req.params.leagueId

  clubModel.select(leagueId)
  .then(clubs => (clubs.map(club => (club.clubId))))
  .then(clubIds => (rankNonModel.selectGroup(leagueId, clubIds)))
  .then(ranks => {

    console.log('ranks   : ', ranks)

    return res.json({
      message: 'success',
      ranks: ranks
    })
  })
}