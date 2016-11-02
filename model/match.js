const conn = require('./conn')

exports.select = leagueId => {

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
      )homeImageS,
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
      if (
        m.kickoffTime < now() and isnull(m.homeScore), 0, m.homeScore
      ),
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
      )awayImageS,
      homeScore,
      if (
        m.kickoffTime < now() and isnull(m.awayScore), 0, m.awayScore
      )
      awayScore,
      m.leagueId,
      m.stadium,
      m.note,
      m.link
    from \`match\` m, ( SELECT @RNUM := 0 ) R
    where m.leagueId = ? order by kickoffTime`,
    leagueId
  )
}
