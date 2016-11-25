const conn = require('./conn')

/**
 * match table을 컨트롤합니다.
 * @module MatchModel
 */

/**
 * 리그id값으로 id값에 해당하는 리그의 모든 매치를 가져옵니다.
 * @param {int} leagueId
 * @return {Array<Object>} matches
 */
exports.select = leagueId => {

  return conn(
    `select
      concat("#", @RNUM := @RNUM + 1) rownum,
      if(m.homeGiveup, 0,
        (
          if (m.awayGiveup, 3,
              (
                  select
                    count(recordName)score
                  from lineup l
                  join record r on l.lineupId = r.lineupId
                  join \`match\` ma on ma.matchId = l.matchId
                  join player p on l.playerId = p.playerId
                  where (p.clubId = m.awayClubId and recordName = 'ownGoal' and ma.matchId = m.matchId)
                  or (p.clubId = m.homeClubId and (r.recordName = 'goalScored' or r.recordName = 'penaltyScored'))
                  and ma.matchId = m.matchId
                )
          )
        )
      )homeScore,
      if(m.awayGiveup, 0,
        (
          if (m.homeGiveup, 3,
              (
                  select
                    count(recordName)score
                  from lineup l
                  join record r on l.lineupId = r.lineupId
                  join \`match\` ma on ma.matchId = l.matchId
                  join player p on l.playerId = p.playerId
                  where (p.clubId = m.homeClubId and recordName = 'ownGoal' and ma.matchId = m.matchId)
                  or (p.clubId = m.awayClubId and (r.recordName = 'goalScored' or r.recordName = 'penaltyScored'))
                  and ma.matchId = m.matchId
                )
          )
        )
      )awayScore,
      m.homeGiveup,
      m.awayGiveup,
      m.matchId,
      m.matchName,
      m.kickoffTime,
      m.homeClubId,
      (
        select (select teamId from team t where t.teamId = c.teamId)teamName
        from club c
        where m.homeClubId = c.clubId
      )
      homeTeamId,
      (
        select (select teamName from team t where t.teamId = c.teamId)teamName
        from club c
        where m.homeClubId = c.clubId
      )
      homeClubName,
      (
        select (
          select (
            select fileName from teamImage ti where ti.teamId = t.teamId
          )
          from team t
          where t.teamId = c.teamId
        )
        from club c
        where m.homeClubId = c.clubId
      )
      homeImageS,
      m.awayClubId,
      (
        select (select teamName from team t where t.teamId = c.teamId)teamName
        from club c
        where m.awayClubId = c.clubId
      )
      awayClubName,
      (
        select (select teamId from team t where t.teamId = c.teamId)teamName
        from club c
        where m.awayClubId = c.clubId
      )
      awayTeamId,
      (
        select (
          select (
            select fileName from teamImage ti where ti.teamId = t.teamId
          )
          from team t
          where t.teamId = c.teamId
        )
        from club c
        where m.awayClubId = c.clubId
      )
      awayImageS,
      m.leagueId,
      m.stadium,
      m.giveupNote,
      m.link,
      m.friendlyMatchId
    from \`match\` m, ( SELECT @RNUM := 0 ) r
    where m.leagueId = ? order by kickoffTime`,
    leagueId
  )
}

/**
 * clubId로 해당하는 팀의 경기중 진행해야 할 경기를 가져옵니다.
 * @param {int} leagueId
 * @param {int} clubId
 * @return {Array<Object>} matches
 */
exports.selectWill = (leagueId, clubId) => {
  return conn(`
      select
        m.matchId,
        m.matchName,
        l.community,
        l.season,
        m.kickoffTime,
        m.homeClubId,
        (select (select teamName from team t where t.teamId = c.teamId)teamName from club c where m.homeClubId = c.clubId)homeClubName,
        m.awayClubId,
        (select (select teamName from team t where t.teamId = c.teamId)teamName from club c where m.awayClubId = c.clubId)awayClubName
      from \`match\` m, league l
      where (m.homeClubId = ? or m.awayClubId = ?)
        and m.leagueId = l.leagueId
        and m.matchId not in
          (select m.matchId from lineup l, \`match\` m, player p where l.playerId = p.playerId and l.matchId = m.matchId and p.clubId = ?)
        and l.leagueId = ?
        and m.giveupNote is null
      order by kickoffTime
    `,
    [clubId, clubId, clubId, leagueId]
  )
}

/**
 * matchId로 1개 경기를 가져옵니다.
 * @param {int} matchId
 * @return {Object} match
 */
exports.selectOne = matchId => {
  return conn(
    `select
      m.matchId,
      m.matchName,
      m.kickoffTime,
      m.stadium,
      m.firstHalfTime,
      m.firstHalfAdditional,
      m.secondHalfTime,
      m.secondHalfAdditional,
      if(m.homeGiveup, 0,
        (
          if (m.awayGiveup, 3,
              (
                  select
                    count(recordName)score
                  from lineup l
                  join record r on l.lineupId = r.lineupId
                  join \`match\` ma on ma.matchId = l.matchId
                  join player p on l.playerId = p.playerId
                  where (p.clubId = m.awayClubId and recordName = 'ownGoal' and ma.matchId = m.matchId)
                  or (p.clubId = m.homeClubId and (r.recordName = 'goalScored' or r.recordName = 'penaltyScored'))
                  and ma.matchId = m.matchId
                )
          )
        )
      )homeScore,
      if(m.awayGiveup, 0,
        (
          if (m.homeGiveup, 3,
              (
                  select
                    count(recordName)score
                  from lineup l
                  join record r on l.lineupId = r.lineupId
                  join \`match\` ma on ma.matchId = l.matchId
                  join player p on l.playerId = p.playerId
                  where (p.clubId = m.homeClubId and recordName = 'ownGoal' and ma.matchId = m.matchId)
                  or (p.clubId = m.awayClubId and (r.recordName = 'goalScored' or r.recordName = 'penaltyScored'))
                  and ma.matchId = m.matchId
                )
          )
        )
      )awayScore,
      m.homeGiveup,
      m.awayGiveup,
      m.sky,
      m.temperature,
      m.humidity,
      m.wind,
      m.refereeHead,
      m.refereeAssistant1,
      m.refereeAssistant2,
      refereeFourth,
      m.homeCoach,
      m.awayCoach,
      m.homeClubId,
      (select (select teamName from team t where t.teamId = c.teamId)teamName from club c where m.homeClubId = c.clubId)homeClubName,
      (select (select teamId from team t where t.teamId = c.teamId)teamName from club c where m.homeClubId = c.clubId)homeTeamId,
      m.awayClubId,
      (select (select teamName from team t where t.teamId = c.teamId)teamName from club c where m.awayClubId = c.clubId)awayClubName,
      (select (select teamId from team t where t.teamId = c.teamId)teamName from club c where m.awayClubId = c.clubId)awayTeamId
    from \`match\` m
    where matchId = ?`,
    matchId
  )
  .then(matches => {
    return matches[0]
  })
}


/**
 * 모든 match ID(int) 를 가져옵니다. (for test)
 * @return {Array<Int>} match IDs
 */
exports.selectId = () => {
  return conn(`select * from \`match\``)
  .then(matches => {
    return matches.map(match => (match.matchId))
  })
}