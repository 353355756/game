
/*!
 * Module dependencies.
 */

var mongoose = require('mongoose');
var User = mongoose.model('User');
var async = require('async');
var status = require('../../config/status');
var utilset = require('../../common/utilset');
var common = require('../../common/common');
var commonfunction = require('../../common/commonfunction');
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var fs = require('fs');
var assert= require('assert');
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick : true });
var log4js = require("log4js");
var log = log4js.getLogger('error');


//创建用户-也就是注册
exports.createUser = function (req, res) {
  var email = req.body.email;
  req.body.email = email.toLowerCase();
  var user = new User(req.body);
  user.role = status.Role.GAMEWJ; // need to delete in future//把学生的角色改为机构
  
  async.auto({
    activeToken: function (callback) {
      commonfunction.generateToken(callback);
    },
  }, function (err, results) {
    var activeToken = results.activeToken;
    user.activeToken = activeToken;
    user.save(function (err) {
      if (err) {
        res.render('login/signup', {
          title: '注册',
          user: user,
          error: err,
        });
      } else {
        // crypted password user
        req.logIn(user, function (err) {
          if (err) {
            next(err);
          } else {
            res.redirect('/');
          }
        });
      }
    });
  });
};

//检测用户的信息的唯一性是否正确
exports.checkRegister = function (req, res) {

  var query = {};
  if(req.body.email){
    query = {email: req.body.email};
  }else if(req.body.nickname){
    query = {nickname: req.body.nickname};
  }
  User.find(query,function(err,result){
    if(err){
      res.send({status:1,msg:err,_csrf: res.locals.csrf_token})
    }else{
      if(result.length){
        var msg;
        if(req.body.email){
          msg = "邮箱已注册";
        }else if(req.body.nickname){
          msg = "昵称已注册";
        }
        res.send({status:1,msg:msg,_csrf: res.locals.csrf_token});
      }else{
        res.send({status:0,_csrf: res.locals.csrf_token});
      }
    }
  })
};

//返回某个用户的信息
exports.getUserInfo = function (req, res) {
  //判断查找的用户的id是否为正在登陆的用户的名字
  var suid = req.params.id;
  var user = req.user;
  if(suid == user._id){
    if(user.mobile){
      var mobile = user.mobile.split("");
      user.mobile = mobile[0]+mobile[1]+mobile[2]+"******"+mobile[mobile.length - 3]+mobile[mobile.length-2]+mobile[mobile.length-1];
    }
    //修改一下，如果为值为undefined的话在页面上也会显示undefined所以这里设置为“”
    user.realname = user.realname == undefined ?"":user.realname;
    user.brief = user.brief == "" ? "" : user.brief;
    res.render('userinfo', {
      title: "用户信息",
    });
  }else{
    res.render('404');
  }
};

//重新修改用户信息
exports.setUserInfo = function (req, res) {
  var update = {};
  var body = req.body;
  if(body.realname != ''){
    update.realname = body.realname;
  }
  if(body.nickname != ''){
    update.nickname = body.nickname
  }
  if(body.mobile != ''){
    update.mobile = body.mobile;
  }
  update.gender = body.gender;
  update.brief = body.brief;
  User.findByIdAndUpdate({_id:req.user._id},update,function(err,result){
    if(err){
      res.send({status: 1, _csrf: res.locals.csrf_token,msg: err.message});
    }else{
      res.send({status: 0, _csrf: res.locals.csrf_token});
    }
  })
  
};

//显示修改密码页面
exports.getPassword = function (req, res) {
  res.render('password', {
    title:"修改密码"
  });
};

//修改密码
/*
  2个参数
  1.oldpw:string
  2.newpw:string
*/
exports.setPassword = function (req, res) {
  var uid = req.user._id;
  var oldpw = req.body.oldpw;
  var newpw = req.body.newpw;

  async.auto({
    changepw: function (callback) {
      if (common.decrypt(req.user.password, config.session_secret) == oldpw) {
        var query = {
          _id: uid
        };
        var update = {
          password: common.encrypt(newpw, config.session_secret)
        };
        User.findOneAndUpdate(query, update, function (err, user) {
          if (err) {
            callback(new Error(err.toString()));
          } 
          else {
            req.logout();
            req.logIn(user, function (err) {
              if (err) { callback(new Error(err.toString())); }
              else {
                callback(null);
              }
            });
          }
        });
      } 
      else {
        callback(new Error('旧密码不正确'));
      }
    }
  }, function (err, results) {
    if (err) {
      console.log(err.stack);
      res.send({status: 1, error: err.stack});
    } else {
      res.send({status: 0, _csrf: res.locals.csrf_token});
    }
  });
};


//这里需要添加查询条件，字段为nickname
exports.showUserList = function(req ,res){
  var query = {};
  var nickname = "";
  var type = req.query.type;
  if(type == 'admin'){
    query.role = 0;
  }else if(type == 'gamewj'){
    query.role = 1;
  }else if(type == 'gamegs'){
    query.role = 2;
  }else if(type == 'gadmin'){
    query.role = 3;
  }

  if(req.query.nickname){
    nickname = req.query.nickname;
    query = {
      $or:[
        {nickname: new RegExp(nickname)},//模糊查询参数
        {email: new RegExp(nickname)}
        ]
    };
  }
  User.count(query,function(err,num){
    if(err){
      res.render('404');
    }else{
      res.render('admin/showUserList',{
        title:"用户列表",
        total: num,
        nickname:nickname,//如果有nickname查询条件那么返回，如果没有就不返回
        type: req.query.type
      })
    }
  });
}

exports.removeUser = function (req, res) {
  var uid = req.body.uid;
  User.findById(uid,function(err,user){
    if(err){
      res.send({
        status: 1,
        msg: err.message,
        _csrf: res.locals.csrf_token
      });
    }else{
      user.remove(function(err,results){
        if(err){
          res.send({
            status: 1,
            msg: err.message,
            _csrf: res.locals.csrf_token
          });
        }else{
          res.send({
            status: 0,
            _csrf: res.locals.csrf_token
          });
        }
      })
    }
  })
}

exports.showAddUser = function(req, res){
  res.render("admin/addUser",{
    title:"添加用户"
  })
}
exports.adminCreateUser = function (req, res) {
  var body = req.body;
  var user = body.user;
  async.auto({
    checkEmail:function(callback){
      var query= {email:user.email};
      User.findOne(query,function(err,user){
        if(err){
          callback(new Error(err.message));
        }else if(user){
          callback(new Error("Email已注册，请还另一个email"));
        }else{
          callback();
        }
      }) 
    },
    checkNickname:function(callback){
      var query = {nickname:user.nickname};
      User.findOne(query,function(err,user){
        if(err){
          callback(new Error(err.message));
        }else if(user){
          callback(new Error("昵称已存在，请换另一个昵称"));
        }else{
          callback();
        }
      })
    },
    createUser:['checkEmail','checkNickname',function (callback) {
      new User(user).save(function (err) {
        if (err) { callback(new Error(err.toString())); }
        else { callback(null); }
      });
    }],
  }, 
  function (err, results) {
    if (err) {
      log.error('adminCreateUser Error: ', err.message);
      res.send({
        status: 1,
        msg: err.message,
        _csrf: res.locals.csrf_token
      });
    }
    else {
      res.send({
        status: 0,
        msg:"创建成功",
        _csrf: res.locals.csrf_token
      });
    }
  });
};

/*
管理员根据用户id显示用户信息，思路很简单
  1.获取传入的id，
  2.根据id获取用户信息

*/
exports.adminShow = function(req, res){
  var uid = req.params.id;
  try{
    assert.notEqual(uid, undefined, "传入用户id为空");
  }catch(err){
    log.error(err.message);
    res.render('404');
  }
  User.findById(uid,function(err,user){
    if(err){
      log.error(err.message);
      res.render('500');
    }else{
      res.render('admin/userShow',{
        title:"用户信息",
        currentUser:user
      })
    }
  })
}

exports.getUsersByCondition = function (req, res) {
  var user = req.user;
  var body = req.body;
  var page = body.skipPage;
  var limit = body.perPage;
  var type = body.type;
  var condition = body.condition;
  if (!condition) condition = {};
  if(type == 'admin'){
    condition.role = 0;
  }else if(type == 'gamewj'){
    condition.role = 1;
  }else if(type == 'gamegs'){
    condition.role = 2;
  }else if(type == 'gadmin'){
    condition.role = 3;
  }
  try {
    assert(user, 'empty user');
  }
  catch (e) {
    return res.send({
      status: 1,
      error: e.toString(),
      _csrf: res.locals.csrf_token
    });
  }
  if(body.nickname){
    condition = {
        $or:[
          {nickname: new RegExp(body.nickname)},//模糊查询参数
          {email: new RegExp(body.nickname)}
          ]
      };
  }
  async.auto({
    users: function (callback) {
      User
      .find(condition)
      .skip(page * limit)
      .limit(limit)
      .sort({_id: 1})
      .exec(function (err, users) {
        if (err) {callback(new Error(err.toString())); }
        else {
          callback(null, users);
        }
      });
    },
    handleUsers: ['users', function (callback, results) {
      var users = results.users;
      async.map(users, function (user, done) {
        var obj = {
          actived: user.actived,
          created: user.created.getTime(),
          email: user.email,
          id: user._id,
          mobile: user.mobile == undefined?"未填写":user.mobile,
          nickname: user.nickname,
          realname: user.realname == undefined?"未填写":user.realname,
          role: user.role,
        };
        done(null, obj);
      }, callback);
    }],
  }, function (err, results) {
    if (err) {
      log.error('getUsersByCondition Error: ', err.stack);
      res.send({
        status: 1,
        error: err.stack,
        _csrf: res.locals.csrf_token
      });
    }
    else {
      res.send({
        status: 0,
        users: results.handleUsers,
        _csrf: res.locals.csrf_token
      });
    }
  });
};

exports.updateWJ = function (req, res) {
  var update = {};
  var body = req.body;
  
  if(body.address != ''){
    update.address = body.address;
  }
  if(body.mobile != ''){
    update.mobile = body.mobile;
  }
  var query = {nickname:user.nickname};
  User.findOneAndUpdate(query,update,function(err,result){
    if(err){
      res.send({status: 1, _csrf: res.locals.csrf_token,msg: err.message});
    }else{
      res.send({status: 0, _csrf: res.locals.csrf_token});
    }
  })
  
};