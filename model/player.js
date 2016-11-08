const conn = require('./conn')

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