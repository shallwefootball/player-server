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
exports.selectWill = teamId => {
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
    and
      (
        (
           select (select teamId from team t where t.teamId = c.teamId)teamName
          from club c
          where m.homeClubId = c.clubId
        ) = ?
    or
        (
          select (select teamId from team t where t.teamId = c.teamId)teamName
          from club c
          where m.awayClubId = c.clubId
        ) = ?
    );`,
    [teamId, teamId]
  )
}