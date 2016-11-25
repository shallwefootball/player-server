const conn = require('./conn')

/**
 * league table을 컨트롤합니다.
 * @module LeagueModel
 */

/**
 * 모든 리그정보를 가져옵니다.
 * @return {Array<Object>} leagues
 */
exports.select = () => {

  return conn(`
    select * from league
    where community = "여주"
    and season IS NOT NULL
    and type = 'league'
    order by start desc
  `)
}

/**
 * 과거에 치르어 졌던 모든 league ID(int) 를 가져옵니다. (for test)
 * @return {Array<Int>} league IDs
 */
exports.selectId = () => {
  return conn(`
    select leagueId from league
    where community = "여주"
    and season IS NOT NULL
    and type = 'league'
    and start < now()
    order by start desc
  `)
  .then(leagues => {
    return leagues.map(league => (league.leagueId))
  })
}