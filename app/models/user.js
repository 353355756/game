var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var async = require('async');
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var common = require('../../common/common');
var status = require('../../config/status');
var Counter = require('../controllers/counter');

var UserSchema = Schema({
  _id: Number,
  realname : { type: String, require: true },
  nickname : { type: String, require: true },
  password : { type: String, require: true },
  email : { type: String, require: true },
  avatar: {type: String, default: 'default.jpg'},
  mobile : String,
  address:String,
  age: Number,
  role: {type: Number, default: status.Role.GAMEWJ},
  created : { type: Date, default: Date.now },
  updated : { type: Date, default: Date.now },
  gameCount: [{
    game : {type:Number, ref: 'Game'},
    count: Number,
  }],
  actived : { type: Boolean, default: false },
});

mongoose.model('User', UserSchema);
var User = mongoose.model('User');

UserSchema.path('email').validate(function (email, done) {
  if (this.isNew || this.isModified('email')) {
    User.find({email: email.toLowerCase()}, function (err, users) {
      done(!err && users.length === 0);
    });
  } else {
    done(true);
  }
}, '该邮箱已经被注册');

UserSchema.path('nickname').validate(function (nickname, done) {
  if (this.isNew || this.isModified('nickname')) {
    User.find({nickname: nickname}, function (err, users) {
      done(!err && users.length === 0);
    });
  } else {
    done(true);
  }
}, '该昵称已经存在');

UserSchema.pre('save', function (next) {
  self = this;
  this.password = common.encrypt(this.password, config.session_secret);
  if (self._id) {
    next();
  }else {
    Counter.getIdOf('user', function (err, id) {
      self._id = id;
      next(err);
    });
  }
});
