const moment = require('moment')

const club = [ 1009, 1010, 1011, 1012, 1013, 1014, 1015, 1016 ]

//1-무진, 2-승성, 3-쇼부, 4-호랑이, 7-유로, 13-구일, 14-베르누이, 15-esc
const teamIds = [1, 2, 3, 4, 7, 13, 14, 15]

const totalMatchDay = '28일'

const seqMatches = [
  [ 1016, 1015 ],
  [ 1011, 1013 ],
  [ 1012, 1009 ],
  [ 1010, 1014 ],
  [ 1009, 1011 ],
  [ 1016, 1013 ],
  [ 1015, 1014 ],
  [ 1010, 1012 ],
  [ 1013, 1014 ],
  [ 1012, 1015 ],
  [ 1010, 1009 ],
  [ 1016, 1011 ],
  [ 1012, 1013 ],
  [ 1014, 1011 ],
  [ 1010, 1015 ],
  [ 1016, 1009 ],
  [ 1009, 1014 ],
  [ 1010, 1011 ],
  [ 1016, 1012 ],
  [ 1015, 1013 ],
  [ 1012, 1011 ],
  [ 1010, 1013 ],
  [ 1014, 1016 ],
  [ 1009, 1015 ],
  [ 1009, 1013 ],
  [ 1016, 1010 ],
  [ 1015, 1011 ],
  [ 1012, 1014 ],
  [ 1013, 1011 ],
  [ 1014, 1010 ],
  [ 1009, 1012 ],
  [ 1015, 1016 ],
  [ 1015, 1010 ],
  [ 1009, 1016 ],
  [ 1013, 1012 ],
  [ 1011, 1014 ],
  [ 1016, 1014 ],
  [ 1011, 1012 ],
  [ 1015, 1009 ],
  [ 1013, 1010 ],
  [ 1013, 1016 ],
  [ 1014, 1015 ],
  [ 1012, 1010 ],
  [ 1011, 1009 ],
  [ 1014, 1013 ],
  [ 1009, 1010 ],
  [ 1011, 1016 ],
  [ 1015, 1012 ],
  [ 1014, 1009 ],
  [ 1013, 1015 ],
  [ 1011, 1010 ],
  [ 1012, 1016 ],
  [ 1010, 1016 ],
  [ 1014, 1012 ],
  [ 1011, 1015 ],
  [ 1013, 1009 ]
]

const insertClub = temaIds => {
  return temaIds.map(teamId => {
    return `insert into club (teamId, formation, leagueId) values (${teamId}, '4-3-3', 2)`
  })
}

const insertMatch = seqMatches => {
  return seqMatches.map(match => {

  })
}


// const fixWeekend = weeks.filter((weekend, i) => {
//   return (i + 1) % 3
// })

// console.log('fixWeekend  : ', fixWeekend)

// const insert = (matchId, players) => {

//   return Promise.all(players.map(player => {
//     return conn(`insert into lineup (playerId, matchId, matchPosition, status, orderNumber) values (?, ?, ?, ?, ?)`,
//       [player.playerId, matchId, player.matchPosition, player.status, player.orderNumber]
//     )
//   }))
//   .then(values => {
//     return values
//   })
// }

// console.log('seqMatch   ; ', seqMatch)