const conn = require('./conn')

exports.select = matchId => {

  return conn(`
    select
      r.recordId,
      r.recordName,
      r.minutes,
      r.lineupId,
      concat(u.lastName, u.firstName) playerName,
      p.squadNumber,
      p.clubId,
      r.recordId,
      r.recordName,
      r.minutes,
      r.lineupId
    from record r, lineup l, user u, player p
    where r.lineupId = l.lineupId
      and u.userId = p.userId
      and l.playerId = p.playerId
      and l.matchId = ?
    order by minutes desc, recordId desc`,
  matchId)
}

exports.insert = ({recordName, time, minutes, lineupId}) => {
  return conn(`insert into record(recordName, time, minutes, lineupId) values(?, ?, ?, ?)`,
    [recordName, time, minutes, lineupId]
  )
}
