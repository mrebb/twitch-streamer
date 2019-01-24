'use strict';
require('dotenv').config();
require('babel-register');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true });
// This will require our "app.js" file and immediately call its 'start' method, sending the port from .env
require('./app.js').start(process.env.PORT || 8080);