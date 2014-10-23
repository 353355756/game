var alipay = require('qkapliy');
var host = 'http://www.91-edu.org/';
var config = {
    partner:'2088211068281522', //合作身份者id，以2088开头的16位纯数字
    key:'4zfdiioahodu1dcxzdjr6e8fx15xl66b',//安全检验码，以数字和字母组成的32位字符
    seller_email:'newseam@live.com', //卖家支付宝帐户 必填 
    host:host,
  	cacert:'cacert.pem',//ca证书路径地址，用于curl中ssl校验 
  	transport:'http', //访问模式,根据自己的服务器是否支持ssl访问，若支持请选择https；若不支持请选择http
  	input_charset:'utf-8',//字符编码格式 目前支持 gbk 或 utf-8
  	create_direct_pay_by_user_return_url: host+'/orderresult',//填写完整路径,
  	create_direct_pay_by_user_notify_url: host+'/ordernotify',

};

var Alipay = require('qkapliy').Alipay;

var alipay = new Alipay(config);
module.exports = alipay;