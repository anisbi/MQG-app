var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cloudinary = require('cloudinary');
var multer = require('multer');
//var ng-file-upload = require('ng-file-upload');
var passport = require('passport');

require('./models/Questionnaire');
require('./models/Question');
require('./models/Solution');
require('./models/User');
require('./config/passport');


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.use('/ng-file-upload', express.static(__dirname + '/node_modules/ng-file-upload/dist/'));
app.use('/sweetalert2', express.static(__dirname + '/node_modules/sweetalert2/dist/'));
app.use('/cloudinary', express.static(__dirname + '/node_modules/cloudinary/'));
app.use('/angular-file-upload', express.static(__dirname + '/node_modules/angular-file-upload/dist/'));
app.use('/angular-drag-and-drop-lists', express.static(__dirname + '/node_modules/angular-drag-and-drop-lists/'));
/*
app()

//cloudinary setup
cloudinary.config({ 
  cloud_name: 'mqg-app', 
  api_key: '915422969141235', 
  api_secret: 'C45ncwZGLu1lZe86oQ3DDcdUcuc' 
});
*/

//db connect
mongoose.connect('mongodb://localhost:27017/qmaker2');
//mongoose.connect('mongodb://mradmin:QSAd32$a{x@ds149479.mlab.com:49479/mqg-app')

mongoose.connection.on('error', function(err) {
    console.log('MongoDB error: %s', err);
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use('/', routes);
//app.use('/users', users);

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

// catch unauthorized errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(402);
    res.json({"message" : err.name + ": "+err.message});
  }
});


app.use(multer({

 dest: './uploads/'

}).any());

module.exports = {

uploadImage: function(req, res, next) {
   if(req.files.file) {
     cloudinary.uploader.upload(req.files.file.path, function(result) {
       if (result.url) {
         req.imageLink = result.url;
         console.log(result.url);
         next();
       } else {
         res.json(error);
       }
     });
   } else {
     next();
   }
 }
};
module.exports = app;
