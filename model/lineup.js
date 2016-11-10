const conn = require('./conn')

exports.insert = (matchId, players) => {

  return Promise.all(players.map(player => {
    return conn(`insert into lineup (playerId, matchId, matchPosition, status, orderNumber) values (?, ?, ?, ?, ?)`,
      [player.playerId, matchId, player.matchPosition, player.status, player.orderNumber]
    )
  }))
  .then(values => {
    return values
  })
}
