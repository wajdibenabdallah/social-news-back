import { Strategy } from 'passport-local';
import User from '../models/user';

export default function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.email);
  });

  passport.deserializeUser(function (email, done) {
    User.find({ email: email }, function (err, user) {
      done(err, user);
    });
  });

  passport.use(
    new Strategy({ usernameField: 'email' }, (username, password, done) => {
      User.findOne({ email: username }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Password is wrong' });
        }
        return done(null, user);
      });
    })
  );
}
