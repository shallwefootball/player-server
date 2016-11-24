const conn = require('../conn')

/**
 * non으로 분류한 이유는 기존 db table을 바탕으로 새로운 table을 만들어서 리턴하기 때문입니다.
 * @module RankNonModel
 */

/**
 * 해당하는 리그의 그룹 순위를 리턴합니다.
 * @param {int} leagueId
 * @param {Array<Int>} club Ids
 * @return {Array<Object>} club rankings
 */
exports.selectGroup = (leagueId, clubIds) => {

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