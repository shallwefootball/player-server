const conn = require('./conn')

exports.selectOne = email => {

  return conn(`
    select
      u.userId,
      concat(u.lastName, u.firstName) playerName,
      DATE_FORMAT(u.birthday, "%Y/%m/%d") birthday,
      u.email,
      u.password
    from user u
    where u.email = ?
  `, email)
    .then(user => {
      return user[0]
    })
}


exports.selectChar = char => {
  return conn(`
    SELECT
      SQL_CALC_FOUND_ROWS u.userId,
      concat(u.lastName, u.firstName)userName,
      if(isnull(t.teamName), "소속팀없음", t.teamName) teamName
    FROM user u
    left outer join player p on p.userId = u.userId
    left outer join club c on c.clubId = p.clubId
    left outer join team t on c.teamId = t.teamId
    WHERE u.firstName LIKE "%${char}%"
      OR u.lastName LIKE "%${char}%"
      OR concat(u.lastName, u.firstName) LIKE "%${char}%"
    group by u.userId limit 5
  `)
}


