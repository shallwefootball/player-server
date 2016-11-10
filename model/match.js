const conn = require('./conn')

/**
 * Match Model module.
 * @module matchModel
 */

/**
 * 리그id값으로 id값에 해당하는 리그의 모든 매치를 가져옵니다.
 * @param {int} leagueId
 */
exports.selectLeague = leagueId => {

  return conn(
    `select
      concat("#", @RNUM := @RNUM + 1) AS rownum,
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
      if (
        m.kickoffTime < now() and isnull(m.homeScore), 0, m.homeScore
      )
      homeScore,
      if (
        m.kickoffTime < now() and isnull(m.awayScore), 0, m.awayScore
      )
      awayScore,
      m.leagueId,
      m.stadium,
      m.note,
      m.link,
      m.friendlyMatchId
    from \`match\` m, ( SELECT @RNUM := 0 ) R
    where m.leagueId = ? order by kickoffTime`,
    leagueId
  )
}



/**
 * teamId로 해당하는 팀의 경기중 진행해야하는 경기를 가져옵니다.
 * @param {int} teamId
 */
exports.selectWill = clubId => {
  return conn(`
    select
      concat("#", @RNUM := @RNUM + 1) AS rownum,
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
      m.homeScore,
      m.awayScore,
      m.leagueId,
      m.stadium,
      m.note,
      m.link,
      m.friendlyMatchId
    from \`match\` m, ( SELECT @RNUM := 0 ) R
    where homeScore is null
    and awayScore is null
    and (homeClubId = ? or awayClubId = ?)`,
    [clubId, clubId]
  )
}

/**
 * matchId로 1개 경기를 가져옵니다.
 * @param {int} matchId
 */
exports.selectOne = matchId => {
  return conn(
    `select
      m.matchId,
      m.matchName,
      year(m.kickoffTime) year,
      month(m.kickoffTime) month,
      DAY(m.kickoffTime) day,
      hour(m.kickoffTime) hour,
      m.stadium,
      hour(m.firstHalfTime) firstHalfHour,
      date_format(m.firstHalfTime, "%i") firstHalfMinute,
      m.firstHalfAdditional,
      hour(m.secondHalfTime) secondHalfHour,
      date_format(m.secondHalfTime, "%i") secondHalfMinute,
      m.secondHalfAdditional,
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
      (select (select teamId from team t where t.teamId = c.teamId)teamName from club c where m.awayClubId = c.clubId)awayTeamId,
      if ( m.kickoffTime < now() and isnull(m.homeScore), 0, m.homeScore) homeScore,
      if ( m.kickoffTime < now() and isnull(m.awayScore), 0, m.awayScore) awayScore
    from \`match\` m
    where matchId = ?`,
    matchId
  )
    .then(matches => {
      return matches[0]
    })
}