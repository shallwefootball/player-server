const express = require('express')
const Route = express.Router()
const passport = require('passport')
const leagueModel = require('./model/league')
const teamModel = require('./model/team')
const matchModel = require('./model/match')
const clubModel = require('./model/club')
const playerModel = require('./model/player')

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
  .get('/league/:leagueId', (req, res) => {
    matchModel.selectLeague(req.params.leagueId)
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
  .get('/will-match/:clubId', (req, res) => {
    matchModel.selectWill(req.params.clubId)
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
    playerModel.selectClubId(req.params.clubId)
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