const conn = require('./conn')

exports.select = leagueId => {

  return conn(`
    select * from club c
    join team t on c.teamId = t.teamId
    where leagueId = ?`,
    leagueId
  )
}


/**
 * clubId로 팀의 정보를 가져옵니다.
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

/**
 * temp팀을 제외하고 정규리그에 참가한 club를 가져옵니다
 * @param {int} leagueId
 */
exports.selectExceptTemp = leagueId => {
  return conn(`
    select * from club c
    join team t on c.teamId = t.teamId
    where leagueId = ? and t.isTempTeam is NULL`,
    leagueId
  )
}