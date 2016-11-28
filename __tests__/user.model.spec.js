const _ = require('lodash')
const userModel = require('../model/user')
const modelUtil = require('../model/util')
const SELECT_EMAIL = 'drogvory@gmail.com'
const TEST_EMAIL = 'test@swfb.com'
const CHAR = '김'

describe('userModel', () => {
  const keys = Object.keys(userModel)
  it('api의 갯수는 4 이다.', () => (expect(keys.length).toEqual(4)))
  it('selectOne 가 포함 되어있다.', () => (expect(keys).toContain('selectOne')))
  it('selectChar 가 포함 되어있다.', () => (expect(keys).toContain('selectChar')))
  it('insert 가 포함 되어있다.', () => (expect(keys).toContain('insert')))
  it('delete 가 포함 되어있다.', () => (expect(keys).toContain('delete')))
})


describe('userModel.selectOne', () => {
  describe('임의의 email를 인자로 받아', () => {

    it('Object 리터럴 객체를 리턴한다.',  () => {
      return userModel.selectOne(SELECT_EMAIL)
      .then(user => {
        expect(_.isObject(user)).toBeTruthy()
      })
    })


    describe('user의 속성은', () => {

      let keys;
      beforeAll(() => {
        return userModel.selectOne(SELECT_EMAIL)
        .then(user => {
          keys = Object.keys(user)
        })
      })

      it('갯수는 5 이다.', () => (expect(keys.length).toEqual(5)))
      it('userId 가 포함 되어있다.', () => (expect(keys).toContain('userId')))
      it('playerName 가 포함 되어있다.', () => (expect(keys).toContain('playerName')))
      it('birthday 가 포함 되어있다.', () => (expect(keys).toContain('birthday')))
      it('email 가 포함 되어있다.', () => (expect(keys).toContain('email')))
      it('password 가 포함 되어있다.', () => (expect(keys).toContain('password')))
    })

  })
})



describe('userModel.selectChar', () => {
  describe('임의의 문자를 인자로 받아', () => {


    it('배열을 리턴한다.',  () => {
      return userModel.selectChar(CHAR)
      .then(users => {
        expect(_.isArray(users)).toBeTruthy()
      })
    })
    it('각각 인덱스는 객체리터럴이다.',  () => {
      return userModel.selectChar(CHAR)
      .then(users => {
        expect(users.every(user => {
          return _.isObject(user)
        })).toBeTruthy()
      })
    })

    describe('선수의 속성은', () => {
      let keys;
      beforeAll(() => {
        return userModel.selectChar(CHAR)
        .then(users => {
          keys = Object.keys(users[0])
        })
      })

      it('갯수는 3 이다.', () => (expect(keys.length).toEqual(3)))
      it('userId 가 포함 되어있다.', () => (expect(keys).toContain('userId')))
      it('userName 가 포함 되어있다.', () => (expect(keys).toContain('userName')))
      it('teamName 가 포함 되어있다.', () => (expect(keys).toContain('teamName')))
    })

  })
})


describe('userModel.insert', () => {
  afterAll(() => {
    return userModel.delete(TEST_EMAIL)
    .then(res => {
      modelUtil.resetAutoIncrement('user')
    })
  })
  it('user를 생성을 성공한다.', () => {
    return userModel.insert({email: TEST_EMAIL})
    .then(res => {
      expect(res.affectedRows).toBe(1)
    })
  })
})


describe('userModel.delete', () => {
  beforeAll(() => {
    return userModel.insert({email: TEST_EMAIL})
  })
  afterAll(() => {
    return modelUtil.resetAutoIncrement('user')
  })
  it('user를 삭제를 성공한다.', () => {
    return userModel.delete(TEST_EMAIL)
    .then(res => {
      expect(res.affectedRows).toBe(1)
    })
  })
})

