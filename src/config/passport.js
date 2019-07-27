const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email'
      },
      function(username, password, done) {
        User.findOne(
          {
            email: username
          },
          function(err, user) {
            if (err) {
              return done(err);
            }
            if (!user) {
              return done(null, false, {
                message: 'User not found'
              });
            }
            if (!user.validPassword(password)) {
              return done(null, false, {
                message: 'Password is wrong'
              });
            }
            return done(null, user);
          }
        );
      }
    )
  );
};
