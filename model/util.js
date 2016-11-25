const conn = require('./conn')

exports.resetAutoIncrement = tableName => {

  return conn(`alter table \`${tableName}\` AUTO_INCREMENT = 1`)
}