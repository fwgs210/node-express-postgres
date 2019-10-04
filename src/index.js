require('dotenv').config({ path: '.env' });



const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const enforce = require('express-sslify');
const isDev = process.env.NODE_ENV !== 'production'

const { uri, PORT } = require('./config/serverSetup')
const initAdminUser = require('./utils/initAdminUser')
const routes = require('./routes')
const notFoundRoute = require('./routes/notFound')

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
  app.use(require('prerender-node'));
  console.log('production mode on', PORT)
  // app.use(enforce.HTTPS({ trustProtoHeader: true })) // set trustProtoHeader TRUE for heroku
  // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // allow self assigned SSL
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/v1', routes)

app.get('/', (req, res) => {
  res.send(`Express app is running!`)
})

// If that above routes didnt work, we 404 them and forward to error handler
app.use(notFoundRoute);

app.listen(PORT, err => {
  if (err) throw err;
  console.log(`✅  Server is up and running on port ${PORT}.`)
})
