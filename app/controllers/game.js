
/*!
 * Module dependencies.
 */

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Game = mongoose.model('Game');
var async = require('async');
var status = require('../../config/status');
var utilset = require('../../common/utilset');
var common = require('../../common/common');
var commonfunction = require('../../common/commonfunction');
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var fs = require('fs');
var assert= require('assert');
var log4js = require("log4js");
var log = log4js.getLogger('error');
var util = require('./util');


//创建游戏玩家
exports.CreateWJUser = function (req, res) {
  var body = req.body;
  var user = body.user;
  async.auto({
    checkNickname:function(callback){
      var query = {nickname:user.nickname};
      User.findOne(query,function(err,user){
        if(err){
          callback(new Error(err.message));
        }else {
          callback(null,user);
        }
      })
    },
    createUser:['checkNickname',function (callback,results) {
      if(results.checkNickname){
        callback(null,results.checkNickname._id);
      }else{
        new User(user).save(function (err,user) {
          if (err) { 
            callback(new Error(err.toString())); 
          }else {
            callback(null,user._id);
          }
      });
      }
      
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
        _id:results.createUser,
        _csrf: res.locals.csrf_token
      });
    }
  });
};

//更新玩过的次数
var wcount = exports.CreateWJUser = function (req, res) {
  var body = req.body;
  var gameId = body.gameId;
  var userId = body.userId;
  async.auto({
    checkUserId:function(callback){
      User.findById(userId,function(err,user){
        if(err){
          callback(new Error(err.toString())); 
        }else{
          callback(null,user); 
        }
      })
    },
    updateGameCount:['checkUserId',function (callback,results) {
      if(results.checkUserId){
        //更新次数
      }else{
        callback(new Error("没有找到该用户"));
      }
    }],
  }, 
  function (err, results) {
    if (err) {
      log.error('CreateWJUser Error: ', err.message);
      res.send({
        status: 1,
        msg: err.message,
        _csrf: res.locals.csrf_token
      });
    }
    else {
      res.send({
        status: 0,
        count:results.updateGameCount,
        _csrf: res.locals.csrf_token
      });
    }
  });
}

exports.game = function(req, res){
  res.render('addGameuser',{
          title:"游戏列表",
        })
}
exports.gameUserSave = function(req, res){
  var gameid = req.params.id;
  var body = req.body;
  var user = body.user;
  async.auto({
    checkNickname:function(callback){
      var query = {nickname:user.nickname};
      User.findOne(query,function(err,user){
        if(err){
          callback(new Error(err.message));
        }else {
          callback(null,user);
        }
      })
    },
    createUser:['checkNickname',function (callback,results) {
      if(results.checkNickname){
        var query = {gameCount:{"$elemMatch":{"game":gameid}},_id:results.checkNickname._id};
        User.find(query,function(err,users){
          if(err){
            callback(new Error(err.message));
          }else {
            if(users.length){
              User.findOneAndUpdate({"gameCount.game":gameid,"_id":results.checkNickname._id},{"$inc":{"gameCount.$.count":1}},callback);
            }else{
              User.findOneAndUpdate({"_id":results.checkNickname._id},{"$push":{"gameCount":{"game":gameid,"count":1}}},callback);
            }
          }
        })
      }else{
        var gamecount = {
          game:gameid,
          count: 1
        };
        user.password = user.password==null?"123456":user.password;
        user.gameCount = new Array(gamecount);
        user.role = parseInt(user.role);
        new User(user).save(function (err,user) {
          if (err) { 
            callback(new Error(err.toString())); 
          }else {
            callback(null,user);
          }
        });
      }
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
    }else {
      var count = 0;
      var game = results.createUser.gameCount;
      for(var i=0;i<game.length;i++){
        if(game[i].game == gameid){
          count = game[i].count;
        }
      }
      res.send({
        status: 0,
        count:count,
        _csrf: res.locals.csrf_token
      });
    }
  });
}

exports.showGameList = function(req ,res){
  var query = {};
  var role = req.user.role;
  if(role == status.Role.GAMEGS){
    query = {company:req.user._id};
  }
  Game.count(query,function(err,num){
    if(err){
      res.render('404');
    }else{
      if(role == status.Role.GAMEGS){
        res.render('company/showGameList',{
          title:"游戏列表",
          total: num
        })
      }else{
        res.render('admin/showGameList',{
          title:"游戏列表",
          total: num
        })
      }
    }
  });
}

exports.showAddGame = function(req, res){
  res.render("admin/addGame",{
    title:"添加游戏"
  })
}
exports.adminCreateGame = function(req, res){
  var body = req.body;
  var game = body.game;
  async.auto({
    checkName:function(callback){
      var query = {name:game.name};
      Game.findOne(query,function(err,game){
        if(err){
          callback(new Error(err.message));
        }else if(game){
          callback(new Error("名称已存在，请换另一个名称"));
        }else{
          callback();
        }
      })
    },
    createUser:['checkName',function (callback) {
      new Game(game).save(function (err) {
        if (err) { callback(new Error(err.toString())); }
        else { callback(null); }
      });
    }],
  }, 
  function (err, results) {
    if (err) {
      log.error('adminCreateGame Error: ', err.message);
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

exports.getGameByCondition = function (req, res) {
  var body = req.body;
  var page = body.skipPage;
  var limit = body.perPage;
  var role = req.user.role;
  var query = {};
  if(role == status.Role.GAMEGS){
    query = {company:req.user._id};
  }
  Game
    .find(query)
    .populate('company')
    .skip(page * limit)
    .limit(limit)
    .sort({_id: 1})
    .exec(function (err, games) {
      if (err) {
        log.error('getGameByCondition Error: ', err.stack);
        res.send({
          status: 1,
          error: err.stack,
          _csrf: res.locals.csrf_token
        });
      }
      else {
        res.send({
          status: 0,
          games: games,
          _csrf: res.locals.csrf_token
        });
      }
    });
};

exports.showGameUsers = function(req ,res){
  var gameid = req.params.gid;
  var query = {gameCount:{"$elemMatch":{"game":gameid}}};
  User.find(query,function(err,users){
    if(err){
      callback(new Error(err.message));
    }else {
      if(users.length){
        User.findOneAndUpdate({"gameCount.game":gameid},{"$inc":{"gameCount.$.count":1}},callback);
      }else{
        User.findOneAndUpdate({"_id":results.checkNickname._id},{"$push":{"gameCount":{"game":gameid,"count":1}}},callback);
      }
    }
  })
  User.count(query,function(err,num){
    if(err){
      res.render('404');
    }else{
      res.render('admin/showGameList',{
        title:"游戏列表",
        total: num
      })
    }
  });
}

exports.openGame = function(req ,res){
  var gameid = req.params.gid;
  Game.findById(gameid,function(err,game){
    if(err){
      res.render('404');
    }else if(!game){
      res.render('404');
    }else{
      res.redirect("/game/"+gameid+"/index.html");
    }
  });
}

exports.uploadGameZip = function(req ,res){
  var upload = __dirname+'/../../public/game/';
  var files = req.files.upfile;
  var fileName = files.originalname;
  fileName = fileName.split('.');

  var type = fileName[fileName.length-1];

  if(!fs.existsSync(upload)){
    fs.mkdirSync(upload,"777");
  }
  var newName = (new Date()).getTime()+Math.round(Math.random()*100)+'.'+type;
  fs.rename(files.path,upload+newName,function(err){
    if(err){
      res.statusCode = 200;
      res.setHeader('content-type', 'text/html');   
      res.send({'error' : 1,msg:"上传失败，请重新上传"});
    }else{
      util.unzip(upload+newName,upload,function(err){
        if(err){
          res.statusCode = 200;
          res.setHeader('content-type', 'text/html');   
          res.send({'error' : 1,msg:"解压失败，请重新上传"});
        }else{
          res.statusCode = 200;
          res.setHeader('content-type', 'text/html');   
          res.send({msg:"上传成功",_csrf:res.locals.csrf_token});
        }
      });
    }
  });
}