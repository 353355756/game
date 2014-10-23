exports.timeConvert = function (ms) {
  var hours = (ms / ( 60 * 60 * 1000)).toFixed(1).toString();
  var hour = hours.split('.')[0];
  var min = (Number(hours.split('.')[1]) * 6);
  return hour + ' 小时 ' + min + ' 分';
};