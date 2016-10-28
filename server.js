const express = require('express')
const logger = require('morgan');
const bodyParser = require('body-parser')

const app = express()
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.post('/login', (req, res) => {
  console.log('req/???  ;' ,req.body)
  res.json({success: 'ok'})
})

const server = app.listen(4000, function () {
  console.log('Server listening on http://localhost:4000, Ctrl+C to stop')
})


const SocketIo = require('socket.io');
const io = new SocketIo(server, {path: '/api'})
require('./socket-events').connection(io)