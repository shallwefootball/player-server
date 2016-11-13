const conn = require('./conn')

/**
 * Match Model module.
 * @module matchModel
 */

/**
 * clubId로 선수들의 정보를 가져옵니다.
 * @param {int} clubId
 */
exports.selectClub = clubId => {

  return conn(`
    select
      p.playerId,
      (
        select concat(u.lastName, u.firstName)playerName from user u where u.userId = p.userId
      )
      playerName,
      p.position,
      p.squadNumber,
      p.matchPosition,
      p.orderNumber,
      p.status
    from player p
    where p.clubId = ?
    order by p.orderNumber`,
    clubId
  )
}

exports.update = (clubId, players) => {

  return Promise.all(players.map(player => {
    return conn(`
      update player set matchPosition = ?, orderNumber = ?, status = ? where squadNumber = ? and clubId = ?`,
      [player.matchPosition, player.orderNumber, player.status, player.squadNumber, clubId]
    )
  }))
  .then(values => {
    return values
  })
}

/**
 * userId, leagueId로 한선수가 리그의 선수을 리턴합니다.
 * @param {int} userId
 * @param {int} leagueId
 */
exports.selectOneUserLeague = (userId, leagueId) => {
  return conn(`
    select * from player p
    join club c on p.clubId = c.clubId
    where p.userId = ?
      and c.leagueId = ?`,
  [userId, leagueId])
  .then(players => {
    return players[0]
  })
}

exports.insert = ({userId, clubId, squadNumber, position, orderNumber}) => {
  return conn(`
    insert into player (userId, clubId, squadNumber, position, orderNumber) values (?, ?, ?, ?, ?)`,
    [userId, clubId, squadNumber, position, orderNumber])
}