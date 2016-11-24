const matchModel = require('../model/match')
const leagueModel = require('../model/league')

describe('matchModel', () => {
  const keys = Object.keys(matchModel)
  it('api의 갯수는 3 이다.', () => (expect(keys.length).toEqual(3)))
  it('selectLeague 가 포함 되어있다.', () => (expect(keys).toContain('selectLeague')))
  it('selectWill 가 포함 되어있다.', () => (expect(keys).toContain('selectWill')))
  it('selectOne 가 포함 되어있다.', () => (expect(keys).toContain('selectOne')))
})

// describe('matchModel.selectLeague', () => {
//   it('배열이을 리턴한다',  () => {
//     return'matchModel.selectLeague().then(leagues => {
//       expect(_.isArray(leagues)).toBeTruthy()
//     })
//   })
//   it('각각 인덱스는 객체리터럴이다.',  () => {
//     return'matchModel.selectLeague().then(leagues => {
//       expect(leagues.every(league => {
//         return _.isObject(league)
//       })).toBeTruthy()
//     })
//   })
// })