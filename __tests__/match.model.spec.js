const _ = require('lodash')
const matchModel = require('../model/match')
const leagueModel = require('../model/league')

describe('matchModel', () => {
  const keys = Object.keys(matchModel)
  it('api의 갯수는 3 이다.', () => (expect(keys.length).toEqual(3)))
  it('selectLeague 가 포함 되어있다.', () => (expect(keys).toContain('selectLeague')))
  it('selectWill 가 포함 되어있다.', () => (expect(keys).toContain('selectWill')))
  it('selectOne 가 포함 되어있다.', () => (expect(keys).toContain('selectOne')))
})


describe('matchModel.selectLeague', () => {
  describe('임의의 leagueId를 인자로 받아', () => {
    let randomIndex;
    let leagueId;
    beforeAll(() => {
      return leagueModel.selectId().then(leagueIds => {
        randomIndex = (Math.random() * (leagueIds.length - 1)).toFixed()
        leagueId = leagueIds[randomIndex]
      })
    })
    it('배열을 리턴한다.',  () => {
      return matchModel.selectLeague(leagueId)
      .then(leagues => {
        expect(_.isArray(leagues)).toBeTruthy()
      })
    })
    it('각각 인덱스는 객체리터럴이다.',  () => {
      return matchModel.selectLeague(leagueId)
      .then(leagues => {
        expect(leagues.every(league => {
          return _.isObject(league)
        })).toBeTruthy()
      })
    })

    describe('경기의 속성은', () => {
      let keys;
      beforeAll(() => {
        return matchModel.selectLeague(leagueId)
        .then(leagues => {
          keys = Object.keys(leagues[0])
        })
      })

      it('갯수는 21 이다.', () => (expect(keys.length).toEqual(21)))
      it('rownum 가 포함 되어있다.', () => (expect(keys).toContain('rownum')))
      it('homeScore 가 포함 되어있다.', () => (expect(keys).toContain('homeScore')))
      it('awayScore 가 포함 되어있다.', () => (expect(keys).toContain('awayScore')))
      it('homeGiveup 가 포함 되어있다.', () => (expect(keys).toContain('homeGiveup')))
      it('awayGiveup 가 포함 되어있다.', () => (expect(keys).toContain('awayGiveup')))
      it('matchId 가 포함 되어있다.', () => (expect(keys).toContain('matchId')))
      it('matchName 가 포함 되어있다.', () => (expect(keys).toContain('matchName')))
      it('kickoffTime 가 포함 되어있다.', () => (expect(keys).toContain('kickoffTime')))
      it('homeClubId 가 포함 되어있다.', () => (expect(keys).toContain('homeClubId')))
      it('homeTeamId 가 포함 되어있다.', () => (expect(keys).toContain('homeTeamId')))
      it('homeClubName 가 포함 되어있다.', () => (expect(keys).toContain('homeClubName')))
      it('homeImageS 가 포함 되어있다.', () => (expect(keys).toContain('homeImageS')))
      it('awayClubId 가 포함 되어있다.', () => (expect(keys).toContain('awayClubId')))
      it('awayClubName 가 포함 되어있다.', () => (expect(keys).toContain('awayClubName')))
      it('awayTeamId 가 포함 되어있다.', () => (expect(keys).toContain('awayTeamId')))
      it('awayImageS 가 포함 되어있다.', () => (expect(keys).toContain('awayImageS')))
      it('leagueId 가 포함 되어있다.', () => (expect(keys).toContain('leagueId')))
      it('stadium 가 포함 되어있다.', () => (expect(keys).toContain('stadium')))
      it('giveupNote 가 포함 되어있다.', () => (expect(keys).toContain('giveupNote')))
      it('link 가 포함 되어있다.', () => (expect(keys).toContain('link')))
      it('friendlyMatchId 가 포함 되어있다.', () => (expect(keys).toContain('friendlyMatchId')))

    })
  })
})
