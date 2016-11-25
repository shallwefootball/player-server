const _ = require('lodash')
const matchModel = require('../model/match')
const leagueModel = require('../model/league')
const MIXED_CLUB_ID = 11
const TEMP_LEAGUE_ID_FOR_WILL = 6

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
      .then(matches => {
        expect(_.isArray(matches)).toBeTruthy()
      })
    })
    it('각각 인덱스는 객체리터럴이다.',  () => {
      return matchModel.selectLeague(leagueId)
      .then(matches => {
        expect(matches.every(match => {
          return _.isObject(match)
        })).toBeTruthy()
      })
    })

    describe('경기의 속성은', () => {
      let keys;
      beforeAll(() => {
        return matchModel.selectLeague(leagueId)
        .then(matches => {
          keys = Object.keys(matches[0])
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


describe('matchModel.selectWill', () => {

  // 임의의 mixed match를 db에 꽂고 matchId = 999999999 해서 진행
  // 테스트를 진행한 뒤에
  // 추가한 mixed match 삭제
  // autoincrement 재정렬

  describe('고정 클럽과 고정 리그로 테스트를 진행한다', () => {  //추후에 랜덤으로 테스트
    it('배열을 리턴한다.',  () => {
      return matchModel.selectWill(TEMP_LEAGUE_ID_FOR_WILL, MIXED_CLUB_ID)
      .then(matches => {
        expect(_.isArray(matches)).toBeTruthy()
      })
    })
    it('각각 인덱스는 객체리터럴이다.',  () => {
      return matchModel.selectWill(TEMP_LEAGUE_ID_FOR_WILL, MIXED_CLUB_ID)
      .then(matches => {
        expect(matches.every(match => {
          return _.isObject(match)
        })).toBeTruthy()
      })
    })

    describe('경기의 속성은', () => {
      let keys;
      beforeAll(() => {
        return matchModel.selectWill(TEMP_LEAGUE_ID_FOR_WILL, MIXED_CLUB_ID)
        .then(matches => {
          keys = Object.keys(matches[0])
        })
      })

      it('갯수는 9 이다.', () => (expect(keys.length).toEqual(9)))
      it('matchId 가 포함 되어있다.', () => (expect(keys).toContain('matchId')))
      it('matchName 가 포함 되어있다.', () => (expect(keys).toContain('matchName')))
      it('community 가 포함 되어있다.', () => (expect(keys).toContain('community')))
      it('season 가 포함 되어있다.', () => (expect(keys).toContain('season')))
      it('kickoffTime 가 포함 되어있다.', () => (expect(keys).toContain('kickoffTime')))
      it('homeClubId 가 포함 되어있다.', () => (expect(keys).toContain('homeClubId')))
      it('homeClubName 가 포함 되어있다.', () => (expect(keys).toContain('homeClubName')))
      it('awayClubId 가 포함 되어있다.', () => (expect(keys).toContain('awayClubId')))
      it('awayClubName 가 포함 되어있다.', () => (expect(keys).toContain('awayClubName')))

    })
  })
})
