const express = require('express');
const path = require('path');
const logger = require('morgan');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const pagefinder = require('./routes/page-finder');
const memento = require('./routes/memento');
const catalog = require('./routes/catalog');
const stops = require('./routes/stops');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(favicon(path.join('./', 'statics', 'favicon.png')))
app.use(cookieParser());

app.use('/', pagefinder);
app.use('/memento', memento);
//app.use('/catalog', catalog);
app.use('/stops', stops);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send();
  //res.render('error');
});

module.exports = app;
