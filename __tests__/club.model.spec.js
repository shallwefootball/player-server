const _ = require('lodash')
const clubModel = require('../model/club')
const leagueModel = require('../model/league')

describe('clubModel', () => {
  const keys = Object.keys(clubModel)
  it('api의 갯수는 3 이다.', () => (expect(keys.length).toEqual(3)))
  it('select 가 포함 되어있다.', () => (expect(keys).toContain('select')))
  it('selectOne 가 포함 되어있다.', () => (expect(keys).toContain('selectOne')))
  it('selectId 가 포함 되어있다.', () => (expect(keys).toContain('selectId')))
})


describe('clubModel.select', () => {
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
      return clubModel.select(leagueId)
      .then(clubs => {
        expect(_.isArray(clubs)).toBeTruthy()
      })
    })
    it('각각 인덱스는 객체리터럴이다.',  () => {
      return clubModel.select(leagueId)
      .then(clubs => {
        expect(clubs.every(match => {
          return _.isObject(match)
        })).toBeTruthy()
      })
    })
  })
})

describe('clubModel.selectId', () => {
  it('배열리턴한다',  () => {
    return clubModel.selectId().then(ids => {
      expect(_.isArray(ids)).toBeTruthy()
    })
  })
  it('각각의 인덱스는 int이다.',  () => {
    return clubModel.selectId().then(ids => {
      expect(ids.every(id => {
        return _.isInteger(id)
      })).toBeTruthy()
    })
  })
})

describe('clubModel.selectOne', () => {
  describe('임의의 clubId를 인자로 받아', () => {

    let randomIndex;
    let clubId;
    beforeAll(() => {
      return clubModel.selectId().then(clubIds => {
        randomIndex = (Math.random() * (clubIds.length - 1)).toFixed()
        clubId = clubIds[randomIndex]
      })
    })

    it('Object 리터럴 객체를 리턴한다.',  () => {
      return clubModel.selectOne(clubId)
      .then(club => {
        expect(_.isObject(club)).toBeTruthy()
      })
    })

    describe('club의 속성은', () => {

      let keys;
      beforeAll(() => {
        return clubModel.selectOne(clubId)
        .then(club => {
          keys = Object.keys(club)
        })
      })

      it('갯수는 12 이다.', () => (expect(keys.length).toEqual(12)))
      it('clubId 가 포함 되어있다.', () => (expect(keys).toContain('clubId')))
      it('leaderId 가 포함 되어있다.', () => (expect(keys).toContain('leaderId')))
      it('formation 가 포함 되어있다.', () => (expect(keys).toContain('formation')))
      it('teamId 가 포함 되어있다.', () => (expect(keys).toContain('teamId')))
      it('leagueId 가 포함 되어있다.', () => (expect(keys).toContain('leagueId')))
      it('createdAt 가 포함 되어있다.', () => (expect(keys).toContain('createdAt')))
      it('teamName 가 포함 되어있다.', () => (expect(keys).toContain('teamName')))
      it('brief 가 포함 되어있다.', () => (expect(keys).toContain('brief')))
      it('information 가 포함 되어있다.', () => (expect(keys).toContain('information')))
      it('createId 가 포함 되어있다.', () => (expect(keys).toContain('createId')))
      it('currentImageId 가 포함 되어있다.', () => (expect(keys).toContain('currentImageId')))
      it('isTempTeam 가 포함 되어있다.', () => (expect(keys).toContain('isTempTeam')))


    })
  })
})