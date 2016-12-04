const _ = require('lodash')
const teamModel = require('../model/team')

describe('teamModel', () => {
  const keys = Object.keys(teamModel)
  it('api의 갯수는 2 이다.', () => (expect(keys.length).toEqual(2)))
  it('select 가 포함 되어있다.', () => (expect(keys).toContain('select')))
  it('selectOne 가 포함 되어있다.', () => (expect(keys).toContain('selectOne')))
})


describe('teamModel.select', () => {
  it('배열을 리턴한다.',  () => {
    return teamModel.select()
    .then(clubs => {
      expect(_.isArray(clubs)).toBeTruthy()
    })
  })
  it('각각 인덱스는 객체리터럴이다.',  () => {
    return teamModel.select()
    .then(clubs => {
      expect(clubs.every(match => {
        return _.isObject(match)
      })).toBeTruthy()
    })
  })
})