const express = require('express')
const logger = require('morgan');
const bodyParser = require('body-parser')
const passport = require('passport')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const auth = require('./auth')
const sLogger = require('./logger')
const route = require('./route')

const app = express()
app.use(cors());
app.use(logger('dev'))

app.use(cookieParser());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.use(express.static(__dirname + '/image'))

app.use(passport.initialize())
app.use(passport.session({
  maxAge: new Date(Date.now() + 3600000)
}));
auth(passport)

app.use(route)


const server = app.listen(4000, function () {
  console.log('Server listening on http://localhost:4000, Ctrl+C to stop')
})


const SocketIo = require('socket.io')
const io = new SocketIo(server, {path: '/api'})
require('./socket-events').connection(io)