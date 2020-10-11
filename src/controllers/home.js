import passport from 'passport';
import User from '../models/user';

// register
const register = (req, res) => {
  try {
    let user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
    });

    if (!user.passwordIsValid(req.body.password, req.body.confirmPassword)) {
      res.status(500).json({ error: `Password confirmation invalid` });
      return;
    }

    user.setPassword(req.body.password);

    user.save((error) => {
      if (error) {
        res.status(500).json({ error: error });
        return;
      }
      res.json({
        id: user._id,
        token: user.generateJwt(),
      });
    });
  } catch (exception) {
    res.status(500).json({ error: `Register: Unknown error` });
  }
};

// login
const login = (req, res) => {
  try {
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
  } catch (exception) {
    res.status(500).json({ error: `Login: Unknown error` });
  }
};

// logout
const logout = (req, res) => {
  req.headers['authorization'] = null;
  res.status(200).json({
    message: 'Successful logout',
  });
};

export { login, register, logout };
