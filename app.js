var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//Require models
var Users = require('./models/users');

var apiAuthRouter = require('./routes/api/auth');
var apiUsersRouter = require('./routes/api/users');
var authRouter = require('./routes/auth');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

if(process.env.NODE_ENV==='production'){
  var config = require('../config.prod');
}else{
  var config = require('./config.dev');
}

var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articlesRouter = require('./routes/articles');
var cmsRouter = require('./routes/cms');
var listsRouter = require('./routes/lists');
var apiUsersRouter = require('./routes/api/users');
var apiArticlesRouter = require('./routes/api/articles');
var apiListsRouter = require('./routes/api/lists');

var app = express();

mongoose.connect(config.mongodb, { useNewUrlParser: true });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('express-session')({
  //Define the session store
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: '/',
    domain: config.cookie.domain,
    maxAge: 1000 * 60 * 24 // 24 hours
    }
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(Users.createStrategy());

passport.serializeUser(function(user, done){
  done(null,{
    id: user._id,
    username: user.username,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name
  });
});

passport.deserializeUser(function(user, done){
  done(null, user);
});

//Setup view variables
app.use(function(req,res,next){
  var userSession={};

  if(req.isAuthenticated()){
    userSession = req.session.passport.user;
  }

  req.app.locals = {
    session: {
      user: userSession
    }
  }

  next();
});

//Session based access control
app.use(function(req,res,next){
  //Skip the Whitelist for debug and dev. (Angular)
  return next();

  var whitelist = [
    '/',
    '/favicon.ico',
    '/users/login',
    '/users/register'
    ];

  if(whitelist.indexOf(req.url) !== -1){
    return next();
  }

  //Allow access to dynamic end points
  var subs = [
    '/public',
    '/articles'
  ];

  for(var sub of subs){
    if(req.url.substring(0, sub.length)===sub){
      return next();
    }
  }

  if(req.isAuthenticated()){
    return next();
  }

//  return res.redirect('/auth#login');
  return res.redirect('/users/login');
});

//Set up CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
    next();
  }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);
app.use('/lists', listsRouter);
app.use('/cms', cmsRouter);
app.use('/api/users', apiUsersRouter);
app.use('/api/articles', apiArticlesRouter);
app.use('/api/lists', apiListsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;