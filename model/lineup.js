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

/**
 * matchId, clubId로 한경기에 뛰었던 한클럽의 선수들을 가져옵니다.
 * @param {int} matchId
 * @param {int} clubId
 */
exports.selectMatchClub = (matchId, clubId) => {
  return conn(`
    select
      li.lineupId,
      li.playerId,
      concat(u.lastName, u.firstName) playerName,
      p.squadNumber,
      li.matchId,
      li.matchPosition,
      li.status,
      li.orderNumber
    from lineup li, user u, player p
    where li.matchId = ?
      and li.playerId = p.playerId
      and p.userId = u.userId
      and p.clubId = ?
    order by orderNumber`,
  [matchId, clubId])
}