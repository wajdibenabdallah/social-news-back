import passport from 'passport';
import mongoose from 'mongoose';

// register
const register = (req, res, next) => {
  let User = mongoose.model('User');
  let user = new User();
  user.email = req.body.email;
  user.setPassword(req.body.password);
  user.save(err => {
    if (err) return next(err);
    res.json({
      token: user.generateJwt(),
      user: user
    });
  });
};

// login
const login = (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    let token;
    if (err) {
      res.status(404).json(err);
      return;
    }
    if (user) {
      token = user.generateJwt();
      res.status(200);
      res.json({
        token: token
      });
    } else {
      res.status(401).json(info);
    }
  })(req, res);
};

// logout
const logout = (req, res) => {
  req.logout();
  res.send('logout');
};

export { login, register, logout };
