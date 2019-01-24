'use strict';
// Third Party Modules
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';

// user owned modules
import router from './api/api';
import errorHandler from './middleware/error.js';
import notFound from './middleware/404.js';
const SESSION_SECRET   = process.env.SESSION_SECRET;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({secret: SESSION_SECRET, resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req,res,next) {
  res.setHeader('Access-Control-Allow-Origin', `${process.env.CLIENT_URL}`);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  next();
});

// API
app.use(router);
app.use(notFound);
app.use(errorHandler);
app.use(express.static('public'));

let server = false;

//Start and stop server
module.exports = {
  start: (port) => {
    if(!server) {
      server = app.listen(port, (err) => {
        if(err) { throw err; }
        console.log('Server running on ' + port);
      });
    } else {
      console.log('Server is already running');
    }
  },
  stop: () => {
    server.close(() => {
      console.log('Server has closed');
    });
  },
  server: app,
};