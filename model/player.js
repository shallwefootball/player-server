const conn = require('./conn')

/**
 * Match Model module.
 * @module matchModel
 */

/**
 * clubId로 선수들의 정보를 가져옵니다.
 * @param {int} clubId
 */
exports.selectClubId = clubId => {

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