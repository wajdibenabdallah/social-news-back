import passport from 'passport';
import mongoose from 'mongoose';

// register
const register = (req, res) => {
  let User = mongoose.model('User');
  let user = new User();
  
  user.email = req.body.email;
  user.setPassword(req.body.password);
  user.save(err => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }
    res.json({
      token: user.generateJwt(),
      user: user
    });
  });
};

// login
const login = (req, res) => {
  passport.authenticate('local', (error, user, info) => {
    let token;
    if (error) {
      res.status(404).json(error);
      return;
    }
    if (user) {
      token = user.generateJwt();
      req.login(user, err => {
        if (err) {
          res.status(500).json({ error: err });
          return;
        }
        res.status(200).json({ token: token });
      });
    } else {
      res.status(401).json({ info: info });
    }
  })(req, res);
};

// logout
const logout = (req, res) => {
  req.logout();
  res.send('logout');
};

export { login, register, logout };
