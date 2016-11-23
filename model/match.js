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
    from \`match\` m, ( SELECT @RNUM := 0 ) R
    where m.leagueId = ? order by kickoffTime`,
    leagueId
  )
}



/**
 * teamId로 해당하는 팀의 경기중 진행해야하는 경기를 가져옵니다.
 * @param {int} leagueId
 * @param {int} clubId
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
        (select (select teamName from team t where t.teamId = c.teamId)teamName from club c where m.awayClubId = c.clubId)awayClubName,
        note
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
 */
exports.selectOne = matchId => {
  return conn(
    `select
      m.matchId,
      m.matchName,
      m.kickoffTime,
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
      (select (select teamId from team t where t.teamId = c.teamId)teamName from club c where m.awayClubId = c.clubId)awayTeamId
    from \`match\` m
    where matchId = ?`,
    matchId
  )
    .then(matches => {
      return matches[0]
    })
}


exports.selectClubFixture = (leagueId, clubId) => {


  return conn(`
    select
      concat("#", @RNUM := @RNUM + 1) AS rownum,
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
      m.homeGiveup,
      m.awayGiveup,
      m.leagueId,
      m.stadium,
      m.giveupNote,
      m.link,
      m.friendlyMatchId
    from \`match\` m, ( SELECT @RNUM := 0 ) R
    where m.leagueId = ?
    and m.matchName not in ('대체경기')
    and (m.homeClubId = ? or m.awayClubId = ?)
    order by kickoffTime
  `,
  [leagueId, clubId, clubId])

}


exports.selectGroupRank = (leagueId, clubIds) => {

  const whereQuery = clubIds.map((clubId, i) => {
    return ` ((mc.homeClubId = ${clubId} or mc.awayClubId = ${clubId}) and c.clubId = ${clubId}) ` + (clubIds.length - 1 != i ? `or` : ``)
  }).join('')

  return conn(`
    select
     c.clubId,
    (select teamName from team t where t.teamId = c.teamId) teamName,
    sum(if(isnull(mc.firstHalfTime) and isnull(mc.giveupNote), 0, 1)) played,
    sum(case
         when ((c.clubId = mc.homeClubId) and mc.homeScore > mc.awayScore)
              then 3
         when ((c.clubId = mc.awayClubId) and mc.awayScore > mc.homeScore)
              then 3
         when (mc.homeScore = mc.awayScore)
              then 1
         else 0 end) points,
    sum(if(
         (
              ((c.clubId = mc.homeClubId)
                   and (mc.homeScore > mc.awayScore))
              or
              ((c.clubId = mc.awayClubId)
                   and (mc.awayScore > mc.homeScore))
         ),
         1, 0)) won,
    sum(case
         when (not(isnull(mc.firstHalfTime) and isnull(mc.giveupNote)) and mc.homeScore = mc.awayScore)
                   then 1
              else 0 end) drawn,
    sum(case
         when ((c.clubId = mc.homeClubId) and (mc.homeScore < mc.awayScore))
              then 1
         when ((c.clubId = mc.awayClubId) and (mc.awayScore < mc.homeScore))
              then 1
         else 0 end) lost,
    sum(case
         when (c.clubId = mc.homeClubId)
              then mc.homeScore
         when (c.clubId = mc.awayClubId)
              then mc.awayScore
         when (not(isnull(mc.firstHalfTime) and isnull(mc.giveupNote)) and mc.homeScore = mc.awayScore)
              then mc.homeScore
         else 0 end) \`for\`,
    sum(case
         when (c.clubId = mc.homeClubId)
              then mc.awayScore
         when (c.clubId = mc.awayClubId)
              then mc.homeScore
         when (not(isnull(mc.firstHalfTime) and isnull(mc.giveupNote)) and mc.homeScore = mc.awayScore)
              then mc.homeScore
         else 0 end) \`against\`,
    sum((
         (
              case
                   when (c.clubId = mc.homeClubId)
                        then mc.homeScore
                   when (c.clubId = mc.awayClubId)
                        then mc.awayScore
                   when (not(isnull(mc.firstHalfTime) and isnull(mc.giveupNote)) and mc.homeScore = mc.awayScore)
                        then mc.homeScore
                   else 0 end
         )
         -
         (
              case
                   when (c.clubId = mc.homeClubId)
                        then mc.awayScore
                   when (c.clubId = mc.awayClubId)
                        then mc.homeScore
                   when (not(isnull(mc.firstHalfTime) and isnull(mc.giveupNote)) and mc.homeScore = mc.awayScore)
                        then mc.homeScore
                   else 0 end
         )
    )) different
    from
      (
        select
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
          m.homeClubId,
          m.awayClubId,
          m.firstHalfTime,
          m.giveupNote
        from \`match\` m
        where m.matchName not in ('대체경기')
        and m.leagueId = ?

      )as mc,
      club c
    where ${whereQuery}
    group by c.clubId
    order by points desc
  `, leagueId)
}