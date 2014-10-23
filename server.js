
/**
 * Module dependencies
 */

var express = require('express');
var http = require('http');
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];
var mongoose = require('mongoose');
var fs = require('fs');

//require('express-namespace');
console.log('config.db:' + config.db);
mongoose.connect(config.db);

// import models
require('./app/models/counter');
fs.readdirSync(__dirname + '/app/models').forEach(function (file) {
  if (~file.indexOf('.js')) require(__dirname + '/app/models/' + file);
});

require('./config/passport')(config);

var app = express();

// use socket.io
// var server = http.createServer(app);
// var io = socket_io.listen(server);

// Bootstrap application settings
require('./config/express')(app, config);

// Bootstrap routes
require('./config/routes')(app);

// Start the app by listening on <port>
var port = process.env.PORT || 3000;

// Expose app
app.listen(port);
module.exports = app;
