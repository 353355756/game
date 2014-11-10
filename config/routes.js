
/**
 * Module dependencies
 */

var passport = require('passport');
var fs = require('fs');
var auth = require('./middleware/auth');

var ctrls = {};
fs.readdirSync(__dirname + '/../app/controllers').forEach(function (file) {
  if (~file.indexOf('.js')) ctrls[file] = require(__dirname + '/../app/controllers/' + file);
});

module.exports = function (app) {
 // app.get('/game/:id',ctrls['game.js'].game);
  //app.get('/',ctrls['home.js'].home);
  app.get('/',ctrls['home.js'].login);
  app.post('/', passport.authenticate('local', {
      failureRedirect: '/',
      failureFlash: true,
    }),ctrls['home.js'].checkLogin);
  //註冊頁面
  app.post('/signup', ctrls['user.js'].createUser);
  app.get('/signup', ctrls['home.js'].signup);
  app.post('/checkregister', ctrls['user.js'].checkRegister);
  //登出頁面
  app.get('/logout', ctrls['home.js'].logout);
  
  //用户信息页面
  app.get('/userinfo/:id', auth.authLogin, ctrls['user.js'].getUserInfo);
  //修改信息页面
  app.post('/userinfo', auth.authLogin, ctrls['user.js'].setUserInfo);
  //显示修改密码页面
  app.get('/password/:id', auth.authLogin, ctrls['user.js'].getPassword);
  //修改密码
  app.post('/password', auth.authLogin, ctrls['user.js'].setPassword);


  //管理员-显示用户列表
  app.get('/admin/users', auth.authAdminLogin, ctrls['user.js'].showUserList);
  app.post('/admin/users', auth.authAdminLogin, ctrls['user.js'].getUsersByCondition);
  app.get('/admin/user/show/:id', auth.authAdminLogin, ctrls['user.js'].adminShow);
  app.post('/admin/removeuser', auth.authAdminLogin, ctrls['user.js'].removeUser);
  //管理员-显示创建用户页面
  app.get('/admin/user', auth.authAdminLogin, ctrls['user.js'].showAddUser);
  app.post('/admin/user', auth.authAdminLogin, ctrls['user.js'].adminCreateUser);

  /**激活操作相关路由**/
  //显示激活页面
  app.get('/active', auth.authLogin, ctrls['home.js'].newActive);

  app.get('/game', ctrls['game.js'].game);
  app.post('/game/:id', ctrls['game.js'].gameUserSave);
  app.get('/show/games', auth.authLogin,ctrls['game.js'].showGameList);
  app.post('/show/games', auth.authLogin, ctrls['game.js'].getGameByCondition);
  //管理员-显示创建游戏页面
  app.get('/admin/game', auth.authAdminLogin, ctrls['game.js'].showAddGame);
  app.post('/admin/game', auth.authAdminLogin, ctrls['game.js'].adminCreateGame);
  //游戏玩家信息录入
  app.post('/admin/users', ctrls['user.js'].updateWJ);
  app.get('/show/gameUsers/:gid', auth.authLogin, ctrls['game.js'].showGameUsers);
  //打开游戏
  app.get('/open/game/:gid', ctrls['game.js'].openGame);
  app.post('/gameupload', auth.authLogin,ctrls['game.js'].uploadGameZip);
  app.get('/admin/game/show/:gid', auth.authLogin,ctrls['game.js'].showGame);
  app.post('/admin/update/game/:gid', auth.authLogin,ctrls['game.js'].updateGame);
};

