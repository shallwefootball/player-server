const matchModel = require('../model/match')

test('selectLeague는 정의되어있다.', () => {
  console.log('matchModel  : ', matchModel)
  expect(matchModel.selectLeague).toBeDefined()
});