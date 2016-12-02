const teamModel = require('../model/team')

describe('teamModel', () => {
  const keys = Object.keys(teamModel)
  it('api의 갯수는 2 이다.', () => (expect(keys.length).toEqual(2)))
  it('select 가 포함 되어있다.', () => (expect(keys).toContain('select')))
  it('selectOne 가 포함 되어있다.', () => (expect(keys).toContain('selectOne')))
})
