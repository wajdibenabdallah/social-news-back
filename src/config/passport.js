import { Strategy } from 'passport-local';
import User from '../models/User';

export default function(passport) {
  passport.use(
    new Strategy(
      {
        usernameField: 'email'
      },
      (username, password, done) => {
        User.findOne(
          {
            email: username
          },
          (err, user) => {
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
          }
        );
      }
    )
  );
}
