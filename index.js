const mongoose = require('mongoose');
require('./config/db');

const express = require('express');
const exphbs = require('express-handlebars');
const router = require('./routes');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const passport = require('./config/passport');
const createError = require('http-errors');

require('dotenv').config({path: 'variables.env'});

const app = express();

// Enable BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Enable Handlebars Template Engine as View
app.engine('handlebars',
    exphbs.engine({ 
        defaultLayout: 'layout',
        helpers: require('./helpers/handlebars')
    })
);
// Enable camp validation
app.use(expressValidator());

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.DATABASE})
}));

// Initilize Passport
app.use(passport.initialize());
app.use(passport.session());

// Enable Flash Messages
app.use(flash());

// Create our own middleware
app.use((req,res,next) => {
    res.locals.mensajes = req.flash();
    next();
});

app.set('view engine', 'handlebars');

app.use('/', router());

// 404 Page
app.use((req, res, next) => {
    next(createError(404, 'No Encontrado'));
})

// Manage errors
app.use((error,req,res,next)=>{
    res.locals.mensaje = error.message;
    const status = error.status || 500;
    res.locals.status = status;
    res.status(status);
    
    res.render('error');
})

const host = '0.0.0.0';
const port = process.env.PUERTO;

// When an error is found , it should be the first param in the middleware
app.listen(port, host, () => {
    console.log('Server is running');
});