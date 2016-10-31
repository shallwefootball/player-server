const conn = require('./conn')

exports.select = leagueId => {

  return conn(`select * from \`match\` where leagueId = ?`, leagueId)
}
