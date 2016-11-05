const conn = require('./conn')

exports.select = () => {

  return conn(`
    select * from league
    where community = "여주"
    and season IS NOT NULL
    order by start desc
  `)
}
