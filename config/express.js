var express = require('express');
var favicon = require('serve-favicon');
var expressLogger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var compression = require('compression');
var session = require('express-session');
var csrf = require('csurf');
var multer  = require('multer');
var path = require('path');
//var req_timeout = require('req-timeout');
var mongoStore = require('connect-mongo')(session);
var helpers = require('view-helpers');
var pkg = require('../package.json');
var flash = require('connect-flash');
var passport = require('passport');
var env = process.env.NODE_ENV || 'development';

var fs = require('fs');
// var accessLogfile = fs.createWriteStream('./log/access.log', {flags: 'a'});
//var errorLogfile = fs.createWriteStream('./log/error.log', {flags: 'a'});
var whiteList = require('./csrfWhiteList');
//var rateLimiter = require('rate-limiter');
//var ipLimitRules = require('./ipLimitRules');
var log4js = require('log4js');
var logConfig = require('./logConfig');
var logger = logConfig.logger;

module.exports = function (app, config) {
  app.set('showStackError', true);
  app.use(compression());
  /*app.use(express.compress({
    filter: function(req, res) {
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
    },
    level: 9,
  }));*/

  // use express favicon
  app.use(favicon(__dirname + '/../public/img/favicon.ico'));
  app.use(express.static(config.root + '/public'));

  // views config
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');

    // expose package.json to views
    app.use(function (req, res, next) {
      res.locals.pkg = pkg;
      res.locals.env = env;
      next();
    });

    // access log config; 
    // use the 'dev' option will confuse to write log into access.log and error.log
    // In production: app.use(express.logger({stream: accessLogfie}));

    app.use(log4js.connectLogger(logger, {
      level: 'auto',
      format: '[:remote-addr] :method :url HTTP/:http-version :status :res[content-length] - :response-time ms',
    }));

    // bodyParser should be above methodOverride
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(multer({ dest: path.join(__dirname, 'files')}));
    app.use(methodOverride());

    // cookieParser should be above session
    app.use(cookieParser());
    app.use(session({
      cookie: {
        maxAge: 60000 * 60 * 24 * 30,
      },
      secret: 'Qiaoker',
      store: new mongoStore({
        url: config.db,
        collection : 'sessions',
      }),
      resave:true,
      saveUninitialized:true,
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    // Flash messages
    app.use(flash());

    app.use(function(req, res,next){
      var err = req.flash('error');
      res.locals.error = err.length? err: null;
      next();
    })
    // View helpers
    app.use(helpers(pkg.name));
    // adds CSRF support
    if (process.env.NODE_ENV !== 'test') {
      var conditionCSRF = function(req, res, next){
        var flag = true;
        var url = whiteList.url.route;
        for(var o in url ){
          if(url[o] == req.originalUrl){
            flag = false;
            res.locals.hasCsrf = false;
            break;
          }
        }
        if(flag){
          res.locals.hasCsrf = true;
          csrf()(req, res,next);
        }else{
          next();
        }
      }
      app.use(conditionCSRF);
      // This could be moved to view-helpers :-)
      app.use(function(req, res, next){
        if(res.locals.hasCsrf){
          res.locals.csrf_token = req.csrfToken();
        }
        next();
      });
    }
    // routes should be at the last
    require('./routes')(app);
    // timeout detail
    app.use(function (err, req, res, next) {
      if (err.timeout) {
        res.send({
          status: 1,
          error: 'Request Timeout',
        });
      }
    });

    app.use(expressLogger('combined'));
    // this error log config should after the router
    app.use(function (err, req, res, next) {
      var meta = '[' + new Date() + '] ' + req.url + '\n';
      res.status(500).render('500', {
        url: req.url,
        error: err.stack,
      });
    });

    // assume 404 since no middleware responded, after log
    app.use(function (req, res, next) {
      var meta = '[' + new Date() + '] ' + req.url + '\n';
      console.error(meta + 'Resourse Not Found' + '\n');
      res.status(404).render('404', {
        url: req.originalUrl,
        error: 'Not found',
      });
    });
    
  if ('development' == env) {
    app.locals.pretty = true;
  }
}
