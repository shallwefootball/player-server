let cacheIo;

exports.connection = (io) => {

  cacheIo = io

  io.on('connection', (socket) => {
    console.log('connetion... : ', socket)
    // socket.on('read timers', () => {
      // timer.read(timers)
      // .then(timer => {
      //   socket.broadcast.emit('bc read timers', timers)
      // })
    // })
  })
}

exports.getIo = () => {
  return cacheIo
}
