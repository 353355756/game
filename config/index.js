/**
 * Created by sankooc on 14-7-11.
 */
var env = process.env.NODE_ENV || 'development'
var config = require('./config')
exports.config=config[env]
exports.redisOption = config.redisOption
