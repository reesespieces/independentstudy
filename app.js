var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stormpath = require('express-stormpath'); //REQUIRE STORMPATH

// Database
var mongo = require('mongodb');
var monk = require('monk');

//TWO DB: MARKERS AND USERS
//var db = monk('localhost:27017/maptest'); //local DB
//var db = monk('mongodb://heroku_vmz14q76:uaslpc7ti5nmgtltb1lqqoko71@ds059195.mongolab.com:59195/heroku_vmz14q76'); //Mongolab DB not the local DB

var db = monk('mongodb://dbuser2:sillydoo@ds059195.mlab.com:59195/heroku_vmz14q76');
//var dbgwc = monk('localhost:27017/gwcfinal');
var dbgwc = monk('mongodb://dbuser2:sillydoo@ds059195.mlab.com:59195/heroku_vmz14q76'); //Connection to the mongolab database collection

var routes = require('./routes/index');
var users = require('./routes/users');
var markers = require('./routes/markers');

//ENV = ENVIRONMENT VARIABLE (I.E. PATH IS AN ENVIORNMENT VARIABLE)
var app = express();
//INTIALIZE STORMPATH
app.use(stormpath.init(app, {
    apiKeyFile: './apiKey-7FM6JP76GUFNTLLN6343W759L.properties', //PERSONALIZED API KEY FILE
    application: process.env.STORMPATH_URL, //CORRESPONDS WITH PACKAGE.JSON
    secretKey: 'lkju8osflij234awn2ouhg982noidjv0912u843nkjndslgiou2398734p209jhsafjp92180kjv', //RANDOM STRING
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Make our db accessible to our router
app.use(function(req,res,next){
    req.dbgwc = dbgwc;
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/markers', markers);
//Here is where it receives information?
app.use('/itinerary', routes);
app.use('search', routes); //ROUTE FOR SEARCH IS IN INDEX.JS

app.use('/adddata', routes); //ROUTE FOR SUBMITTING


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
