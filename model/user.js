const conn = require('./conn')

/**
 * User Model module.
 * @module UserModel
 */


/**
 * email로 user하나를 리턴합니다.
 * @param {String} email
 * @return {Object} user
 */
exports.selectOne = email => {

  return conn(
    `select
      u.userId,
      concat(u.lastName, u.firstName) playerName,
      DATE_FORMAT(u.birthday, "%Y/%m/%d") birthday,
      u.email,
      u.password
    from user u
    where u.email = ?`,
    email)
    .then(user => {
      return user[0]
    })
}

/**
 * 문자를 받아 user들을 리턴합니다. (5개만)
 * @param {String} char
 * @return {Array<Object>} users
 */
exports.selectChar = char => {
  return conn(
    `SELECT
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
    group by u.userId limit 5`
  )
}


/**
 * user를 생성합니다.
 * @param {Object} UserInfo 사용자 정보 Object
 * @param {String} UserInfo.email email
 */
exports.insert = ({email}) => {
  return conn(
    `insert into \`user\` (email) values (?)`,
    email
  )
}

/**
 * user를 삭제합니다.
 * @param {String} email
 */
exports.delete = email => {
  return conn(
    `delete from \`user\` where email = ?`,
    email
  )
}