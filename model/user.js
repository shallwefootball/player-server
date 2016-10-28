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



