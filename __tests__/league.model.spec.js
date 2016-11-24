const _ = require('lodash')
const leagueModel = require('../model/league')


describe('leagueModel', () => {
  const keys = Object.keys(leagueModel)
  it('api의 갯수는 2 이다.', () => (expect(keys.length).toEqual(2)))
  it('select 가 포함 되어있다.', () => (expect(keys).toContain('select')))
  it('selectId 가 포함 되어있다.', () => (expect(keys).toContain('selectId')))
})

describe('leagueModel.select', () => {
  it('배열이을 리턴한다',  () => {
    return leagueModel.select().then(leagues => {
      expect(_.isArray(leagues)).toBeTruthy()
    })
  })
  it('각각 인덱스는 객체리터럴이다.',  () => {
    return leagueModel.select().then(leagues => {
      expect(leagues.every(league => {
        return _.isObject(league)
      })).toBeTruthy()
    })
  })
})

describe('leagueModel.selectId', () => {
  it('배열리턴한다',  () => {
    return leagueModel.selectId().then(ids => {
      expect(_.isArray(ids)).toBeTruthy()
    })
  })
  it('각각의 인덱스는 int이다.',  () => {
    return leagueModel.selectId().then(ids => {
      expect(ids.every(id => {
        return _.isInteger(id)
      })).toBeTruthy()
    })
  })
})