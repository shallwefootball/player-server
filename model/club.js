const conn = require('./conn')

/**
 * Club Model module.
 * @module ClubModel
 */


/**
 * leagueId롤 모든 팀의 정보를 가져옵니다.
 * @param {int} leagueId
 * @return {Array<Object>} clubObjects
 */
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
 * @return {Object} clubInfo
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
 * club ID(int) 를 가져옵니다. formation이 정의되어있는 clubId를 리턴합니다. (for test)
 * @return {Array<Int>} clubIds
 */
exports.selectId = () => {
  return conn(`
    select * from club c where c.formation is not null
  `)
  .then(clubs => {
    return(clubs.map(club => (club.clubId)))
  })
}