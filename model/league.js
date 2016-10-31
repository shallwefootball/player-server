const conn = require('./conn')

exports.select = () => {

  return conn(`select * from league where community = "여주" order by start desc`)
}
