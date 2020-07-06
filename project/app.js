const express = require('express');
const path = require('path');
//const cookieParser = require('cookie-parser');
//const logger = require('morgan');
const session = require('express-session');
const {dbConnect} = require('./models/dbConnect.js');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const testRouter = require('./routes/test');
const tasksRouter = require('./routes/tasks');
const groupsRouter = require('./routes/groups');
const authRouter = require('./routes/auth');
const expAutoSan = require('express-autosanitizer');
const app = express();

//connect to db
dbConnect();

/* Middleware-1 */
//app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret : "h.el1lo,raui&xd!f",
    resave : false,
    saveUninitialized : true,
    cookie : {secure : false}
}));

app.use(expAutoSan.allUnsafe);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);
app.use('/groups', groupsRouter);
app.use('/test', testRouter);
app.use('/auth', authRouter);

module.exports = app;