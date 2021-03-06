const _ = require('lodash')
const playerModel = require('../model/player')
const userModel = require('../model/user')
const clubModel = require('../model/club')
const modelUtil = require('../model/util')
const CONST = require('../constraint').test

describe('playerModel', () => {
  const keys = Object.keys(playerModel)
  it('api의 갯수는 5 이다.', () => (expect(keys.length).toEqual(5)))
  it('select 가 포함 되어있다.', () => (expect(keys).toContain('select')))
  it('update 가 포함 되어있다.', () => (expect(keys).toContain('update')))
  it('selectOneUserLeague 가 포함 되어있다.', () => (expect(keys).toContain('selectOneUserLeague')))
  it('insert 가 포함 되어있다.', () => (expect(keys).toContain('insert')))
  it('delete 가 포함 되어있다.', () => (expect(keys).toContain('delete')))
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



describe('playerModel.insert', () => {
  let newUserId;
  let newClubId;
  let newPlayerId;
  beforeAll(() => {
    return userModel.insert({email: CONST.NEW_EMAIL})
    .then(res => {
      newUserId = res.insertId
      return clubModel.insert()
    })
    .then(res => {
      newClubId = res.insertId
    })
  })
  afterAll(() => {
    return playerModel.delete(newPlayerId)
    .then(res => {
      return modelUtil.resetAutoIncrement('player')
    })
    .then(res => {
      return userModel.delete(CONST.NEW_EMAIL)
    })
    .then(res => {
      return modelUtil.resetAutoIncrement('user')
    })
    .then(res => {
      return clubModel.delete(newClubId)
    })
    .then(res => {
      return modelUtil.resetAutoIncrement('club')
    })
  })

  it('player를 생성을 성공한다.', () => {
    return playerModel.insert({
      userId: newUserId,
      clubId: newClubId,
      squadNumber: 0,
      position: 'TMP',
      orderNumber: 0
    })
    .then(res => {
      newPlayerId = res.insertId
      return expect(res.affectedRows).toBe(1)
    })
  })
})

describe('playerModel.delete', () => {
  let newUserId;
  let newClubId;
  let newPlayerId;
  beforeAll(() => {
    return userModel.insert({email: CONST.NEW_EMAIL})
    .then(res => {
      newUserId = res.insertId
      return clubModel.insert()
    })
    .then(res => {
      newClubId = res.insertId
      return playerModel.insert({
        userId: newUserId,
        clubId: newClubId,
        squadNumber: 0,
        position: 'TMP',
        orderNumber: 0
      })
    })
    .then(res => {
      newPlayerId = res.insertId
    })
  })
  afterAll(() => {
    return clubModel.delete(newClubId)
    .then(res => {
      return userModel.delete(CONST.NEW_EMAIL)
    })
    .then(res => {
      return Promise.all([
        modelUtil.resetAutoIncrement('user'),
        modelUtil.resetAutoIncrement('club'),
        modelUtil.resetAutoIncrement('player')
      ])
    })
  })
  it('player를 삭제를 성공한다.', () => {
    return playerModel.delete(newPlayerId)
    .then(res => {
      expect(res.affectedRows).toBe(1)
    })
  })
})











