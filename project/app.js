const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require('mysql');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dbTestRouter = require('./routes/dbTest');

const app = express();

//database configuration


/* Middleware-1 */
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//middleware-2


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dbTest', dbTestRouter);

module.exports = app;
