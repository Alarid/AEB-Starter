
//-----------------------------------------------------------------------------------------//
// IMPORTS
//-----------------------------------------------------------------------------------------//
var express = require('express'),
	path = require('path'),
	morgan = require('morgan'),
	config = require('./confs/config'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	logger = require('./utils/logger');


//-----------------------------------------------------------------------------------------//
// CONFIGURATION
//-----------------------------------------------------------------------------------------//
var app = module.exports = express();

app.set('view engine', 'ejs');

app.use(morgan(config.debug ? 'dev' : 'common')); // combined, common, default, short, tiny, dev
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));

// configure mongodb
require('./confs/mongo').init(config.mongo.host, config.mongo.port, config.mongo.db, config.debug);


//-----------------------------------------------------------------------------------------//
// ROUTES
//-----------------------------------------------------------------------------------------//
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));