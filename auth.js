const LocalStrategy  = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const logger = require('./logger')
const userModel = require('./model/user')
const CONSTRAINT = require('./constraint')

module.exports = passport => {

  passport.serializeUser((user, done) => {

    done(null, user.email);
  });

  passport.deserializeUser((id, done) => {
    console.log('deserializeUser  : ', id);
    // User.findById(id, function(err, user) {
      done(err, id);
    // });
  });

  passport.use('local-login', new LocalStrategy({
    //input name
    usernameField     : 'email',
    passwordField     : 'password',
    passReqToCallback : true
  },
  (req, email, password, done) => {

    userModel.selectOne(email)
      .then(user => {

        if(user) {
          if(!bcrypt.compareSync(password, user.password)){
            return done(null, false, { message: CONSTRAINT.WRONG_PASSWORD });
          } else {

            logger.read(user.playerName + '님의 로그인.', {user: user, type: CONSTRAINT.LOG_TYPE_LOGIN})
            return done(null, user);
          }

        }else {
          return done(null, false, { message: CONSTRAINT.CANT_FIND_USER });
        }

      })

  }))
}