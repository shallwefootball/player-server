const winston = require('winston')
const conn = require('./model/conn')

const logConfig = {
  levels: {
    read: 0,
    create: 1,
    update: 2,
    delete: 3
  },
  colors: {
    read: 'blue',
    create: 'green',
    update: 'yellow',
    delete: 'red'
  }
}

class MysqlLogger extends winston.Transport {

  log(level, message, meta, callback) {

      conn(`
        insert into log
          (userId, type, level, message, timestamp)
          values (?, ?, ?, ?, ?)`,
        [
          meta.user.userId,
          meta.type,
          level,
          message,
          new Date()
        ]
      )


    // Store this message and metadata, maybe use some custom logic
    // then callback indicating success.
    //
    callback(null, true);
  }
}

const logger = new winston.Logger({
  level: 'read',
  levels: logConfig.levels,
  colors: logConfig.colors,
  transports: [
    new (winston.transports.Console)({
      level: 'read',
      levels: logConfig.levels,
      colorize: true
    }),
    new MysqlLogger
  ]
})

module.exports = logger
