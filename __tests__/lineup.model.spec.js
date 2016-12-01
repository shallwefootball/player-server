const lineupModel = require('../model/lineup')

describe('lineupModel', () => {
  const keys = Object.keys(lineupModel)
  it('api의 갯수는 3 이다.', () => (expect(keys.length).toEqual(3)))
  it('insert 가 포함 되어있다.', () => (expect(keys).toContain('insert')))
  it('selectMatchClub 가 포함 되어있다.', () => (expect(keys).toContain('selectMatchClub')))
  it('selectUser 가 포함 되어있다.', () => (expect(keys).toContain('selectUser')))
})
