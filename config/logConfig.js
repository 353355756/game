var log4js = require("log4js");
log4js.configure(__dirname + '/../log/conf.json', {cwd: __dirname + '/../log'});
var logger = log4js.getLogger('log');
exports.logger = logger;