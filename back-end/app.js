var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cookieSession = require('cookie-session')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var newsRouter = require('./routes/news');
var positionRouter = require('./routes/position');
const position = require('./controller/position')


var authMiddlewares= require('./middlewares/auth')

var app = express();

app.engine('art', require('express-art-template'));
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production',
    escape:false
});
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'art');

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/socket', ws);
app.use('/api/users', usersRouter);
app.use('/api/position/findAll',position.findAll);
app.use('/api/position',positionRouter);
// app.use('/api/news',authMiddlewares,newsRouter);

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
