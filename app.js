var createError = require('http-errors');
var express = require('express');
var path = require('path');
const session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongo')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');

var app = express();

//MONGOOSE SETUP
mongoose.connect('mongodb://localhost/fshop',{ useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
  .then(() => console.log('connected to DB..'))
  .catch(err => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  key: 'user_sid',
  secret: 'hbsdhbsdbvshbvhs',
  saveUninitialized: false,
  cookie: { maxAge: 180 * 60 * 1000 },
  resave: false,
  store: new MongoDBStore({ mongooseConnection: mongoose.connection})
}));

app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid');        
  }
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
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

const server = app.listen(8080, () => {
  console.log('Connected at port 8080..');
});

const io = require('socket.io')(server);
io.on('connection', (socket) => {
  console.log('a user connected');
});

module.exports = app;
