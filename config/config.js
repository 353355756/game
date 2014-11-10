
/*!
 * Module dependencies.
 */

var path = require('path');
var rootPath = path.resolve(__dirname + '../..');
/**
 * Expose config
 */

module.exports = {
  development: {
    root: rootPath,
    db: 'mongodb://mongo.com/game_development',
    app:{
        name: 'game',
    },
    session_secret: 'game',
    tmpDir: '/tmp',
    url:'http://localhost:3000/',
  },
  production: {
    root: rootPath,
    db: 'mongodb://mongo.com/game_production',
    app:{
        name: 'game',
    },
    session_secret: 'game',
    tmpDir: '/tmp',
    url:'http://localhost:3000/',
  }
};
