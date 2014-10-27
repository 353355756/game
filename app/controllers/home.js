
/*!
 * Module dependencies.
 */

var User = require('mongoose').model('User');
var status = require('../../config/status');
//var redis = require('../../comet4/redispool.js');
var assert = require('assert');
var async = require('async');
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var commonfunction = require('../../common/commonfunction');

exports.login = function (req, res) {
  if (req.isAuthenticated()) {
    var user = req.user;
    if(user.role == status.Role.GAMEWJ){
      user.roleText = 'gamewj';
    }else if(user.role == status.Role.GAMEGS){//把学生的角色改为机构
      user.roleText = 'gamegs';
    }else if (user.role == status.Role.ADMIN){
      user.roleText = 'admin';
    }else if (user.role == status.Role.GADMIN){
      user.roleText = 'gadmin';
    }
    res.locals.user = user;
    var uid = req.user._id;
    var token = commonfunction.gen_session(uid.toString());
    //res.redirect("/") ;
    res.render('login/index', {
      title: '登陆',
      message: res.locals.error,
      isLogin: true
    });
  } else {
    res.render('login/index', {
      title: '登陆',
      message: res.locals.error,
      isLogin: true
    });
  }
};

exports.checkLogin = function(req, res){
  if(req.isAuthenticated()){
    var user = req.user;
    if(user.role == status.Role.GADMIN || user.role == status.Role.ADMIN){
      res.redirect('/admin/users');
    }else if(user.role == status.Role.GAMEGS){
      res.redirect('/show/games');
    }else{
      res.redirect('/');
    }
  }else{
    res.locals.error = true;
    req.flash('error',"邮箱或密码错误");
    res.redirect('/');
  }
}

exports.signup = function (req, res) {
  res.render('login/signup', {
    title: '注册',
    isLogin: true
  });
};

exports.logout = function (req, res) {
  req.logout();
  res.redirect('/');
};

exports.newActive = function(req, res){
  res.render('active',{
    title: '帐号激活'
  })
}

exports.home = function (req, res) {
  if (req.isAuthenticated()) {
    var user = req.user;
    if(user.role == status.Role.GAMEWJ){
      user.roleText = 'gamewj';
    }else if(user.role == status.Role.GAMEGS){
      user.roleText = 'gamegs';
    }else if (user.role == status.Role.ADMIN){
      user.roleText = 'admin';
    }else if (user.role == status.Role.GADMIN){
      user.roleText = 'gadmin';
    }
    res.locals.user = user;
    res.render('index', {
      title: '首页',
    });
  }else {
    res.render('index', {
      title: '首页',
    });
  }
};