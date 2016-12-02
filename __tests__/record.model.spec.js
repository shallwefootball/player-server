const recordModel = require('../model/record')

describe('recordModel', () => {
  const keys = Object.keys(recordModel)
  it('api의 갯수는 3 이다.', () => (expect(keys.length).toEqual(3)))
  it('select 가 포함 되어있다.', () => (expect(keys).toContain('select')))
  it('insert 가 포함 되어있다.', () => (expect(keys).toContain('insert')))
  it('delete 가 포함 되어있다.', () => (expect(keys).toContain('delete')))
})
