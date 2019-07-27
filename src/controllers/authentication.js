var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.register = function(req, res, next) {
  var user = new User();
  console.log(req.body)
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

module.exports.login = function(req, res) {
  passport.authenticate('local', function(err, user, info) {
    var token;
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
      // If user is not found
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
