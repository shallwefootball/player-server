const conn = require('./conn')

exports.select = () => {

  return conn(`
    select * from team
    where isTempTeam is null
  `)
}


/**
 * teadId로 팀의 정보를 가져옵니다.
 * @param {int} teamId
 */
exports.selectOne = teamId => {
  return conn(`
      select * from team t where t.teamId = ?
    `,
    teamId
  )
    .then(team => {
      return team[0]
    })

}
