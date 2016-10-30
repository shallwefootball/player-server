const LocalStrategy  = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const userModel = require('./model/user')
const MESSAGE = require('./message')


module.exports = passport => {

  passport.serializeUser((user, done) => {

    console.log('serializeUser  : ', user)
    done(null, user.email);
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
            console.log("비번틀림......");
            return done(null, false, { message: MESSAGE.WRONG_PASSWORD });
          } else {

            // console.log('local-login  user       : ', user);
            return done(null, user);
          }

        }else {
          console.log('선수 못찾음...');
          return done(null, false, { message: MESSAGE.CANT_FIND_USER });
        }

      })

  }))
}

