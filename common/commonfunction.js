var env = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
var crypto = require('crypto');

var password = config.session_secret;

var result = {
     RESULT_SUCCESS: 0,
     RESULT_FAILED: 1,
}

function genJSONResult(status, msg) {
  return JSON.stringify({
    status: status,
    msg: 'object' === typeof msg ? msg.toString() : msg,
  });
};


function gen_session(uid){
  var auth_token = encrypt(uid);
  return auth_token;
  //res.cookie(config.auth_cookie_name, auth_token, {path: '/',maxAge: 1000*60*60*24*7}); //cookie 有效期1周
}
//crypto加密
function encrypt(str){
  var cipher = crypto.createCipher('aes192', password);
  var enc = cipher.update(str,'utf8','hex');
  enc += cipher.final('hex');
  return enc;
}

//crypto解密
function decrypt(str){
  var decipher = crypto.createDecipher('aes192', password);
  var dec = decipher.update(str,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}
//md5加密
function md5(str){
  var md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
}

function authCode() {
  // 6 ~ 8 bit
  return parseInt(crypto.randomBytes(3).toString('hex'), 16);
}

var generateToken = exports.generateToken = function(next) {
  //估计是一个生成数字的算法库
  crypto.randomBytes(64, function(err, buf) {
    var token = buf.toString('hex');
    next(null, token);
  });
};

exports.gen_session = gen_session;
exports.md5 = md5;
exports.decrypt = decrypt;
exports.encrypt = encrypt;
exports.authCode = authCode;
exports.result=result;
exports.genJSONResult=genJSONResult;