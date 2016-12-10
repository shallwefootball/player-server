const express = require('express')
const Route = express.Router()
const passport = require('passport')
const leagueModel = require('./model/league')
const teamModel = require('./model/team')
const matchModel = require('./model/match')
const clubModel = require('./model/club')
const playerModel = require('./model/player')
const recordModel = require('./model/record')
const lineupModel = require('./model/lineup')
const userModel = require('./model/user')

const joinController = require('./controller/join')
const statController = require('./controller/stat')
const fixtureController = require('./controller/fixture')
const clubController = require('./controller/club')

module.exports = Route
  .post('/login', (req, res, next) => {

    passport.authenticate('local-login', (err, user, info) => {
      if (err) { return next(err) }
      if (!user) {
        res.json({login: false, message: info.message})
      }
      req.logIn(user, err => {
        if (err) { return next(err) }

        res.json({
          userId: req.user.userId,
          login: true,
        })
      });
    })(req, res, next)
  })
  .get('/league', (req, res) => {
    leagueModel.select()
      .then(leagues => {
        return res.json({leagues: leagues})
      })
  })
  .get('/matches/:leagueId', (req, res) => {
    matchModel.select(req.params.leagueId)
      .then(matches => {
        return res.json({matches: matches})
      })
  })
  .get('/teams', (req, res) => {
    teamModel.select()
      .then(teams => {
        return res.json({teams: teams})
      })
  })
  .get('/club/:clubId', (req, res) => {
    clubModel.selectOne(req.params.clubId)
      .then(club => {
        return res.json({club: club})
      })
  })
  .get('/will-match/:leagueId/:clubId', (req, res) => {
    matchModel.selectWill(req.params.leagueId, req.params.clubId)
      .then(matches => {
        return res.json({matches: matches})
      })
  })
  .get('/clubs/:leagueId', (req, res) => {
    clubModel.select(req.params.leagueId)
      .then(clubs => {
        return res.json({clubs: clubs})
      })
  })
  .get('/players/:clubId', (req, res) => {
    playerModel.select(req.params.clubId)
      .then(players => {
        return res.json({players: players})
      })
  })
  .get('/match/:matchId', (req, res) => {
    matchModel.selectOne(req.params.matchId)
      .then(match => {
        return res.json({match: match})
      })
  })
  .get('/players/:matchId/:clubId', (req, res) => {
    lineupModel.selectMatchClub(req.params.matchId, req.params.clubId)
      .then(players => {
        return res.json({players: players})
      })
  })
  .get('/records/:matchId', (req, res) => {
    recordModel.select(req.params.matchId)
      .then(records => {
        return res.json({records: records})
      })
  })
  .put('/players', (req, res) => {
    playerModel.update(req.body.clubId, req.body.players)
      .then(() => {
        return res.json({message: 'success'})
      })
  })
  .post('/lineup', (req, res) => {
    lineupModel.insert(req.body.matchId, req.body.players)
      .then(() => {
        return res.json({message: 'success'})
      })
  })
  .get('/users/:char', (req, res) => {
    userModel.selectChar(req.params.char)
      .then(users => {
        return res.json({users: users})
      })
  })
  .post('/player', (req, res) => {

    const { userId, leagueId, clubId } = req.body

    return Promise.all([
      playerModel.selectOneUserLeague(userId, leagueId),
      playerModel.select(clubId)
    ]).then(values => {
      let player = values[0]
      const players = values[1]

      //만약에 leagueId에 해당하는 리그에 등록이 안된 플레이어는 random positon
      const positions = ['DF', 'MF', 'FW']
      const index = (Math.random() * (positions.length - 1)).toFixed()
      if(!player) player = {
        squadNumber: (Math.random() * 100).toFixed(),
        position: positions[index]
      }

      const lastPlayer = players.pop()
      const nextOrderNumber = lastPlayer ? (lastPlayer.orderNumber + 1) : 0

      const newPlayer = {
        userId,
        clubId,
        squadNumber: player.squadNumber,
        position: player.position,
        orderNumber: nextOrderNumber
      }
      return newPlayer
    })
    .then(player => (playerModel.insert(player)))
    .then(() => (playerModel.select(clubId)))
    .then(players => {
      return res.json({players: players})
    })

  })
  .post('/record', (req, res) => {
    const { lineupId, time, minutes, recordName, subLineupId } = req.body

    if(recordName == 'sub') {

      //out first
      recordModel.insert({ lineupId, time, minutes, recordName: 'out' })
      .then(() => (recordModel.insert({ lineupId: subLineupId, time, minutes, recordName: 'in' })))
      .then(() => {
        res.json({message: 'success'})
      })
    }else {
      recordModel.insert({ lineupId, time, minutes, recordName })
        .then(() => {
          res.json({message: 'success'})
        })
    }
  })
  .delete('/record/:recordId', (req, res) => {
    recordModel.delete(req.params.recordId)
      .then(() => {
        res.json({message: 'success'})
      })
  })
  .post('/join', joinController)
  .get('/user-stat/:userId', statController.getUser)
  .get('/unrecorded-matches/:userId', fixtureController.getUnrecordedMatches)
  .get('/league-rank/:leagueId', statController.getLeagueRank)
  .put('/club', clubController.updateClub)