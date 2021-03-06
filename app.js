let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors');
let system = require('./system');

let indexRouter = require('./routes/index');
let childsRouter = require('./routes/childs');
let groupsRouter = require('./routes/groups');
let programsRouter = require('./routes/programs');
let objectsRouter = require('./routes/objects');
let cashTransferRouter = require('./routes/cash-transfer');
let systemRouter = require('./routes/system');
let lessonsRouter = require('./routes/lessons');
let season_ticketsRoute = require('./routes/season_tickets');
let teacherRouter = require('./routes/teacher');
let teacherInfoRouter = require('./routes/teacherInfo');

let app = express();

// view engine setup

let corsOptions = {
    credentials:true,
};
app.options('*', cors(corsOptions));


app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', systemRouter);
app.use('/system_users', indexRouter);
app.use('/childs', childsRouter);
app.use('/lessons', lessonsRouter);
app.use('/groups', groupsRouter);
app.use('/programs', programsRouter);
app.use('/objects', objectsRouter);
app.use('/teachers', teacherRouter);
app.use('/cash-transfer', cashTransferRouter);
app.use('/season_tickets', season_ticketsRoute);
app.use('/teacher-info/', teacherInfoRouter);


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

system();

module.exports = app;
