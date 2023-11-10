var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');


var beritaRouter = require('./app/berita/router');
var dashboardRouter = require('./app/dashboard/router');
var signRouter = require('./app/auth/router');
var kemahasiswaanRouter = require('./app/kemahasiswaan/router');
var perpustakaanRouter = require('./app/perpustakaan/router');
var bursarRouter = require('./app/bursar/router');
var apiRouter = require('./app/api/router');

var app = express();
const URL = `/api/v1/`

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { }
}))
app.use(flash());
app.use(methodOverride('_method'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/adminlte', express.static(path.join(__dirname, '/node_modules/admin-lte')));
app.use('/api/v1/', express.static(path.join(__dirname, 'public/images')));

app.use('/', signRouter);
app.use('/dashboard', dashboardRouter);
app.use('/berita', beritaRouter);
app.use('/kemahasiswaan', kemahasiswaanRouter);
app.use('/perpustakaan', perpustakaanRouter);
app.use('/bursar', bursarRouter);


// Application Programming Interface
app.use(`${URL}students`,apiRouter );



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
