require('dotenv').config({ path: '.env' });

const serverless = require('serverless-http');
const path = require('path');
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const cors = require('cors')
const isDev = process.env.NODE_ENV !== 'production'

const { uri } = require('./config/serverSetup')
const initAdminUser = require('./utils/initAdminUser')
const route = require('./routes')
const routeNotFound = require('./routes/notFound')
const routeError = require('./routes/errorRoute')
require('./middleware/passport');

// Connect to our Database and handle any bad connections
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

const whitelist = [
    'https://www.tracysu.com', 
    'https://tracy-blog.herokuapp.com',
    'https://node-express-api.netlify.com'
]

const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}


// express code here
const app = express()

//set up cors
app.use(cors(corsOptionsDelegate))
app.options('*', cors(corsOptionsDelegate));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

// api
if (!isDev) { // PROD setup
  app.use('/.netlify/functions/app', route) // this is the required setup by netlify
} else {
  app.use(route)
}

// catch 404 and forward to error handler
app.use(routeNotFound);

// error handler
app.use(routeError);

// If that above routes didnt work, we 404 them and forward to error handler

module.exports = app;
module.exports.handler = serverless(app);