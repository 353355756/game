var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('mongoose').model('User');
var common = require('../common/common');
var commonfunction = require('../common/commonfunction');
module.exports = function (config) {
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
    },
    function (email, password, done) {
      User.findOne({email: email.toLowerCase()}, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {message: '对不起, 您的邮箱不正确'});
        }
        var encryptedPassword = common.encrypt(password, config.session_secret);
        if (user.password != encryptedPassword) {
          return done(null, false, {message: '对不起, 您的密码不正确'});
        }
        return done(null, user);
      });
    }
  ));
};