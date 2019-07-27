import passport from 'passport';
import mongoose from 'mongoose';

const register = function(req, res) {
  let User = mongoose.model('User');
  let user = new User();
  user.email = req.body.email;
  user.setPassword(req.body.password);
  user.save(function(err) {
    if (err) throw err;
    res.json({
      token: user.generateJwt(),
      user: user
    });
  });
};

const login = function(req, res) {
  passport.authenticate('local', function(err, user, info) {
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

// // Logout
// router.get('/logout', (req, res) => {
//   req.logout();
//   req.flash('success_msg', 'You are logged out');
//   res.redirect('/users/login');
// });

export { login, register };
