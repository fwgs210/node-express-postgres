require('dotenv').config({ path: '.env' });



const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const isDev = process.env.NODE_ENV !== 'production'
const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
// Configure its options
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
jwtOptions.secretOrKey = process.env.JWTSECRET;

const { uri, PORT } = require('./config/serverSetup')
const initAdminUser = require('./utils/initAdminUser')
const route = require('./routes')

// Connect to our Database and handle any bad connections
mongoose.connect(uri, { useNewUrlParser: true })
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

// express code here
const app = express()
  
if (!isDev) { // PROD setup
  initAdminUser()
  console.log('production mode on', PORT)
}

const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  console.log('payload received', jwt_payload);

  if (jwt_payload) {
      // The following will ensure that all routes using 
      // passport.authenticate have a req.user._id, req.user.userName, req.user.fullName & req.user.role values 
      // that matches the request payload data
      next(null, jwt_payload); 
  } else {
      next(null, false);
  }
});

// tell passport to use our "strategy"
passport.use(strategy);

// add passport as application-level middleware
app.use(passport.initialize());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// api
app.use(route)



app.use('/', (req, res) => {
  res.send(`Express app is running!`)
})

// If that above routes didnt work, we 404 them and forward to error handler

module.exports = app;