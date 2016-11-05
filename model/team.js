const conn = require('./conn')

exports.select = () => {

  return conn(`
    select * from team
    where tempTeam is null
  `)
}
