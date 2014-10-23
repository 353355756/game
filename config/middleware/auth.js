var status = require('../status');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var env = process.env.NODE_ENV || 'development';
var config = require('../config')[env];
var commonfunction = require('../../common/commonfunction');

// exports.authLogin = function (req, res, next) {
//   if (!req.isAuthenticated()) {
//     return res.redirect('/login');
//   }
//   var user = req.user;
//   if(user.role == status.Role.TEACHER){
//   	user.roleText = 'teacher';
//   }else if(user.role == status.Role.STUDENT){
//   	user.roleText = 'student';
//   }else if (user.role == student.Role.ADMIN){
//   	user.roleText = 'admin';
//   }
  
//   res.locals.user = user;
//   next();
// };

exports.authLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    if (req.query.t) {
      var token = req.query.t;
      var uid = commonfunction.decrypt(token);
      // console.log("uid: " + uid);
      
      User.findById(uid, function (err, user) {
        req.logIn(user, function (err) {
          if (err) { 
            next(err); 
          }else {
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
            res.redirect(req.path);
            next();
          }
        });
      });
    }else {

      if(req.method == "POST"){
        return res.send({status:1,msg:'未登录',_csrf: res.locals.csrf_token});
      }else{
        return res.redirect('/login');
      }
    }
  }else {
    if (req.query.t) {
      var token = req.query.t;
      var uid = commonfunction.decrypt(token);
      // console.log("uid: " + uid); 
      User.findById(uid, function (err, user) {
        req.logIn(user, function (err) {
          if (err) { next(err); }
          else {
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
            res.redirect(req.path);
            next();
          }
        });
      });
    }else{
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
      next();
    }
  }
};

exports.authAdminLogin = function (req, res, next) {

  if (!req.isAuthenticated()) {
    if (req.query.t) {
      var token = req.query.t;
      var uid = commonfunction.decrypt(token);
      // console.log("uid: " + uid);
      
      User.findById(uid, function (err, user) {
        req.logIn(user, function (err) {
          if (err) { return next(err); }
          else {
            if (user.role == status.Role.ADMIN){
              user.roleText = 'admin';
            }else if(user.role == status.Role.GADMIN){
              user.roleText = 'gadmin';
            }else {
							return next(new Error('不是管理员'));
						}
            res.locals.user = user;
            res.redirect(req.path);
            next();
          }
        });
      });
    }else {
      if(req.method == "POST"){
        return res.send({
					status:1,
					msg:'未登录',
					_csrf: res.locals.csrf_token
				});
      }else{
        return res.redirect('/login');
      }
    }
  }else {
    var user = req.user;
    if (user.role == status.Role.ADMIN){
      user.roleText = 'admin';
    }else if(user.role == status.Role.GADMIN){
      user.roleText = 'gadmin';
    }else {
      if(req.method == "POST"){
        return res.send({
          status:1,
          msg:'你不是管理员',
          _csrf: res.locals.csrf_token
        });
      }else{
        return res.redirect('/');
      }
			
		}
    res.locals.user = user;
    next();
  }
};
