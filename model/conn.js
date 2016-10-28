const mysql = require('mysql')
const path = require('path')

const config = require('../config')

const pool  = mysql.createPool({
  connectionLimit : 10,
  host            : config.dev.mysql.host,
  user            : config.dev.mysql.user,
  password        : config.dev.mysql.password,
  database        : config.dev.mysql.database
});


/**
 * @func
 * @desc mysql general query connection : 쿼리의 결과값을 리턴합니다.
 * @param {string} query - mysql query
 * @param {Array} args - arguments
 * @return {Thenable}
 */
const conn = (query, args) => {

  return new Promise(resolve => {
    pool.getConnection((err, connection) => {
      connection.query(query, args, (err, result) => {
        if(err) throw err

        if(Array.isArray(result)) {

          resolve(result);

        // result가 Array가 아닐때...
        }else {

          if(result.affectedRows > 0) {

            resolve(result)
          }else {
            console.error('not affectedRows  : ', result);
          }
        }

        connection.release();
      })
    })
  })
}

module.exports = conn
