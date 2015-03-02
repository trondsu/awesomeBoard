'use strict';
/////////////////////
// Package imports //
/////////////////////

var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var passport = require('passport');
var morgan = require('morgan');

// Configuration
var configDB = require('./config/database');
var configServer = require('./config/server');

///////////
// Setup //
///////////

// Initialise server and set port.
var app = express();

// Connect to MongoDB.
mongoose.connect(configDB.url);

// Set up the express application.
app.use(morgan('dev')); // Console logging
app.use(cookieParser());
app.use(bodyParser.urlencoded({ // Parse application/x-www-form-urlencoded
	extended: false
}));
app.use(bodyParser.json()); // Parse application/json

// Login/session setup.
app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: configServer.sessionSecret
}));
require('./app/passport')(app, passport);

// Routes.
app.use(express.static(__dirname + '/public'));
require('./app/routes')(app, passport, configServer);

////////////
// Launch //
////////////
var port = configServer.listenPort;
app.listen(port);
console.log(configServer.title + ' is listening on port ' + port + '.');
