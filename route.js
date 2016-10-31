const express = require('express')
const Route = express.Router()
const passport = require('passport')
const leagueModel = require('./model/league')
const matchModel = require('./model/match')

module.exports = Route
  .post('/login', (req, res, next) => {

    passport.authenticate('local-login', (err, user, info) => {
      if (err) { return next(err) }
      if (!user) {
        return res.json({login: false, message: info.message})
      }
      req.logIn(user, err => {
        if (err) { return next(err) }

        return res.json({login: true})
      });
    })(req, res, next)
  })
  .get('/league', (req, res) => {
    leagueModel.select().then(leagues => {
      return res.json({leagues: leagues})
    })
  })
  .get('/league/:leagueId', (req, res) => {
    matchModel.select(req.params.leagueId)
    .then(matches => {
      return res.json({matches: matches})
    })
  })
