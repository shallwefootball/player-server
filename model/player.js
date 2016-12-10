const conn = require('./conn')

/**
 * Player Model module.
 * @module playerModel
 */

/**
 * clubId로 선수들의 정보를 가져옵니다.
 * @param {int} clubId
 * @return {Array<Object>} 선수들
 */
exports.select = clubId => {

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

/**
 * player를 업데이트합니다.
 * @param {Array<Object>} PlayerInfo 선수정보(Object)가 있는 Array
 * @param {String} PlayerInfo.userId userId
 * @param {String} PlayerInfo.clubId clubId
 * @param {String} PlayerInfo.playerId playerId
 * @param {String} PlayerInfo.position position
 * @param {String} PlayerInfo.orderNumber orderNumber
 */
exports.update = (clubId, players) => {

  return Promise.all(players.map(player => {
    return conn(`
      update player set matchPosition = ?, orderNumber = ?, status = ? where playerId = ? and clubId = ?`,
      [player.matchPosition, player.orderNumber, player.status, player.playerId, clubId]
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
 * @return {Object} playerInfo
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

/**
 * player를 생성합니다.
 * @param {Object} PlyaerInfo 사용자 정보 Object
 * @param {String} PlyaerInfo.userId userId
 * @param {String} PlyaerInfo.clubId clubId
 * @param {String} PlyaerInfo.squadNumber squadNumber
 * @param {String} PlyaerInfo.position position
 * @param {String} PlyaerInfo.orderNumber orderNumber
 */
exports.insert = ({userId, clubId, squadNumber, position, orderNumber}) => {
  return conn(`
    insert into player (userId, clubId, squadNumber, position, orderNumber) values (?, ?, ?, ?, ?)`,
    [userId, clubId, squadNumber, position, orderNumber])
}

exports.delete = playerId => {
  return conn(`delete from \`player\` where playerId = ? `, playerId)
}