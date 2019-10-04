const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const enforce = require('express-sslify');
const isDev = process.env.NODE_ENV !== 'production'

const { uri, PORT } = require('./config/serverSetup')
const initAdminUser = require('./utils/initAdminUser')

mongoose.connect(uri, { useNewUrlParser: true })
// const env = app.get('env');

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
app.use('/api/v1', require('./routes'))

app.get('/', (req, res) => {
  res.send(`Express app is running!`)
})

app.listen(PORT, err => {
  if (err) throw err;
  console.log(`✅  Server is up and running on port ${PORT}.`)
})
