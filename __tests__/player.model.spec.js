const _ = require('lodash')
const playerModel = require('../model/player')
const userModel = require('../model/user')
const clubModel = require('../model/club')
const modelUtil = require('../model/util')
const CONST = require('../constraint').test

describe('playerModel', () => {
  const keys = Object.keys(playerModel)
  it('api의 갯수는 4 이다.', () => (expect(keys.length).toEqual(4)))
  it('select 가 포함 되어있다.', () => (expect(keys).toContain('select')))
  it('update 가 포함 되어있다.', () => (expect(keys).toContain('update')))
  it('selectOneUserLeague 가 포함 되어있다.', () => (expect(keys).toContain('selectOneUserLeague')))
  it('insert 가 포함 되어있다.', () => (expect(keys).toContain('insert')))
})

describe('playerModel.select', () => {
  describe('임의의 clubId를 인자로 받아', () => {

    let randomIndex;
    let clubId;
    beforeAll(() => {
      return clubModel.selectId().then(clubIds => {
        randomIndex = (Math.random() * (clubIds.length - 1)).toFixed()
        clubId = clubIds[randomIndex]
      })
    })

    it('배열을 리턴한다.',  () => {
      return playerModel.select(clubId)
      .then(players => {
        expect(_.isArray(players)).toBeTruthy()
      })
    })
    it('각각 인덱스는 객체리터럴이다.',  () => {
      return playerModel.select(clubId)
      .then(players => {
        expect(players.every(player => {
          return _.isObject(player)
        })).toBeTruthy()
      })
    })

    describe('선수의 속성은', () => {
      let keys;
      beforeAll(() => {
        return playerModel.select(clubId)
        .then(players => {

          keys = Object.keys(players[0])
        })
      })

      it('갯수는 7 이다.', () => (expect(keys.length).toEqual(7)))
      it('playerId 가 포함 되어있다.', () => (expect(keys).toContain('playerId')))
      it('playerName 가 포함 되어있다.', () => (expect(keys).toContain('playerName')))
      it('position 가 포함 되어있다.', () => (expect(keys).toContain('position')))
      it('squadNumber 가 포함 되어있다.', () => (expect(keys).toContain('squadNumber')))
      it('matchPosition 가 포함 되어있다.', () => (expect(keys).toContain('matchPosition')))
      it('orderNumber 가 포함 되어있다.', () => (expect(keys).toContain('orderNumber')))
      it('status 가 포함 되어있다.', () => (expect(keys).toContain('status')))

    })
  })
})


describe('playerModel.selectOneUserLeague', () => {
  describe('임의의 userId와 leagueId를 인자로 받아', () => {
    it('Object 리터럴 객체를 리턴한다.',  () => {
      return playerModel.selectOneUserLeague(CONST.USER_ID, CONST.LEAGUE_ID)
      .then(user => {
        expect(_.isObject(user)).toBeTruthy()
      })
    })


    describe('선수의 속성은', () => {
      let keys;
      beforeAll(() => {
        return playerModel.selectOneUserLeague(CONST.USER_ID, CONST.LEAGUE_ID)
        .then(player => {

          keys = Object.keys(player)
        })
      })

      it('갯수는 13 이다.', () => (expect(keys.length).toEqual(13)))
      it('playerId 가 포함 되어있다.', () => (expect(keys).toContain('playerId')))
      it('userId 가 포함 되어있다.', () => (expect(keys).toContain('userId')))
      it('clubId 가 포함 되어있다.', () => (expect(keys).toContain('clubId')))
      it('squadNumber 가 포함 되어있다.', () => (expect(keys).toContain('squadNumber')))
      it('position 가 포함 되어있다.', () => (expect(keys).toContain('position')))
      it('matchPosition 가 포함 되어있다.', () => (expect(keys).toContain('matchPosition')))
      it('orderNumber 가 포함 되어있다.', () => (expect(keys).toContain('orderNumber')))
      it('status 가 포함 되어있다.', () => (expect(keys).toContain('status')))
      it('createdAt 가 포함 되어있다.', () => (expect(keys).toContain('createdAt')))
      it('leaderId 가 포함 되어있다.', () => (expect(keys).toContain('leaderId')))
      it('formation 가 포함 되어있다.', () => (expect(keys).toContain('formation')))
      it('teamId 가 포함 되어있다.', () => (expect(keys).toContain('teamId')))
      it('leagueId 가 포함 되어있다.', () => (expect(keys).toContain('leagueId')))

    })
  })
})


// {userId, clubId, squadNumber, position, orderNumber}

describe('player.insert', () => {
  let newUserId;
  beforeAll(() => {
    return userModel.insert({email: CONST.NEW_EMAIL})
    .then(res => {
      newUserId = res.insertId
    })
  })
  afterAll(() => {
    return userModel.delete(CONST.NEW_EMAIL)
    .then(res => {
      return modelUtil.resetAutoIncrement('user')
    })
  })
  it('player를 생성을 성공한다.', () => {
  //   return player.insert({email: TEST_EMAIL})
  //   .then(res => {
      expect(2).toBe(1)
  //   })
  })
})


// describe('player.delete', () => {
//   beforeAll(() => {
//     return player.insert({email: TEST_EMAIL})
//   })
//   afterAll(() => {
//     return modelUtil.resetAutoIncrement('user')
//   })
//   it('player를 삭제를 성공한다.', () => {
//     return player.delete(TEST_EMAIL)
//     .then(res => {
//       expect(res.affectedRows).toBe(1)
//     })
//   })
// })











