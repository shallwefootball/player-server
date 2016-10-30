const express = require('express')
const logger = require('morgan');
const bodyParser = require('body-parser')
const passport = require('passport')
const auth = require('./auth')

const app = express()
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session({
  maxAge: new Date(Date.now() + 3600000)
}));
auth(passport)

app.post('/login',
  passport.authenticate('local-login'),
  (...arg) => {
    console.log('arg  : ', arg)
  })

  // passport.authenticate('local-login', {
  //   successRedirect: '/',
  //   failureRedirect: '/login',
  //   failureFlash: true
  // })(req, res, next);


const server = app.listen(4000, function () {
  console.log('Server listening on http://localhost:4000, Ctrl+C to stop')
})


const SocketIo = require('socket.io');
const io = new SocketIo(server, {path: '/api'})
require('./socket-events').connection(io)