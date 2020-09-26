import passport from 'passport';
import mongoose from 'mongoose';

// register
const register = (req, res) => {
  let User = mongoose.model('User');
  let user = new User();

  // user.validateData(req.body);

  user.email = req.body.email;
  user.setPassword(req.body.password);
  user.firstname = req.body.firstName;
  user.lastname = req.body.lastName;
  user.phone = req.body.phone;
  user.save((err) => {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }
    res.json({
      token: user.generateJwt(),
      user: user,
    });
  });
};

// login
const login = (req, res) => {
  passport.authenticate('local', (error, user, info) => {
    if (error) {
      res.status(404).json(error);
      return;
    }
    if (user) {
      let token = user.generateJwt();
      req.login(user, (err) => {
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
  req.headers['authorization'] = null;
  res.status(200).json({
    message: 'Successful logout',
  });
};

export { login, register, logout };
