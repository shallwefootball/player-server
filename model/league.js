const conn = require('./conn')

exports.select = () => {

  return conn(`
    select * from league
    where community = "여주"
    and season IS NOT NULL
    and type = 'league'
    order by start desc
  `)
}
