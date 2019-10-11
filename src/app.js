require('dotenv').config({ path: '.env' });

const serverless = require('serverless-http');
const path = require('path');
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
// const expressValidator = require('express-validator');
const cors = require('cors')
const isDev = process.env.NODE_ENV !== 'production'

const { uri } = require('./config/serverSetup')
const initAdminUser = require('./utils/initAdminUser')
const route = require('./routes')
const routeNotFound = require('./routes/notFound')
const routeError = require('./routes/errorRoute')
const swagger = require('./swagger')
require('./middleware/passport');

// Connect to our Database and handle any bad connections
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

// express code here
const app = express()

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, '../public')));

//set up cors
app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(expressValidator());
app.use(cookieParser());

// api
app.use(route)

// swagger
app.use(swagger)

// catch 404 and forward to error handler
app.use(routeNotFound);

// error handler
app.use(routeError);

// If that above routes didnt work, we 404 them and forward to error handler

module.exports = app;
module.exports.handler = serverless(app);