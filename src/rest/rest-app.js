const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('./db/mongoose');
require('dotenv').config();
require('./commands/commands'); // Yargs commands

const indexRouter = require('./routes');
const usersRouter = require('./routes/users-router');
const weatherRouter = require('./routes/weather');
const taskRouter = require('./routes/task-router');

const restApp = express();

restApp.use(logger('dev'));
restApp.use(express.json());
restApp.use(express.urlencoded({extended: false}));
restApp.use(cookieParser());
restApp.use(express.static(path.join(__dirname, 'public')));

restApp.use('/', indexRouter);
restApp.use('/users', usersRouter);
restApp.use('/tasks', taskRouter);
restApp.use('/weather', weatherRouter);

// catch 404 and forward to error handler
restApp.use(function (req, res, next) {
    next(createError(404));
});

// error handler
restApp.use(function (err, req, res, next) {
    console.log('error handler');
    console.log(err.message);
    console.log(err);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send({error: 'An error has occurred.'});
});

module.exports = restApp;
