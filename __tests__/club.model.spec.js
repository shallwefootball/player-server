const _ = require('lodash')
const clubModel = require('../model/club')

describe('clubModel', () => {
  const keys = Object.keys(clubModel)
  it('api의 갯수는 3 이다.', () => (expect(keys.length).toEqual(3)))
  it('select 가 포함 되어있다.', () => (expect(keys).toContain('select')))
  it('selectOne 가 포함 되어있다.', () => (expect(keys).toContain('selectOne')))
  it('selectExceptTemp 가 포함 되어있다.', () => (expect(keys).toContain('selectExceptTemp')))
})
