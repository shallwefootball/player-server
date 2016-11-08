const conn = require('./conn')

exports.select = () => {

  return conn(`
    select * from team
    where isTempTeam is null
  `)
}


/**
 * deprecated - clubId로 팀의 정보를 가져옵니다.
 * @param {int} clubId
 */
exports.selectOne = clubId => {
  return conn(`
      select * from club c join team t on c.teamId = t.teamId
      where c.clubId = ?;
    `,
    clubId
  )
    .then(club => {
      return club[0]
    })
}
