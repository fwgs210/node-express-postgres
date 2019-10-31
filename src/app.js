require('dotenv').config({ path: '.env' });

const serverless = require('serverless-http');
const path = require('path');
const express = require('express')
const logger = require('morgan');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const cors = require('cors')
const isDev = process.env.NODE_ENV !== 'production'
const route = require('./routes')
const routeNotFound = require('./routes/notFound')
const routeError = require('./routes/errorRoute')
const swagger = require('./swaggerApi')
require('./middleware/passport');
const db = require('../models')


// express code here
const app = express()

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, '../public')));

//set up cors
app.use(cors())
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// api
app.use(route)

// swagger
app.use(swagger)

// catch 404 and forward to error handler
app.use(routeNotFound);

// error handler
app.use(routeError);

// db.Role.create({permission_level: 10, permission_type: 'administrator'})
// db.User.create({ username: 'fwgs210', password: '87532998', email:'test@test1.com', role_level: 1 })
// db.User.create({ username: 'fwgs220', password: '87532998', email:'test@test2.com', role_level: 1 })
// db.User.create({ username: 'fwgs230', password: '87532998', email:'test@test3.com', role_level: 1 })
db.Chatroom.bulkCreate({id: 1, room_name: 'room 1'}, {id: 2, room_name: 'room 2'})
// db.Chat.bulkCreate(
//   { from_user_id: '376f638d-0b12-4611-9239-6e29405427b6', from_chatroom_id: 1, message: 'test content'},
//   { from_user_id: '376f638d-0b12-4611-9239-6e294054as42', from_chatroom_id: 1, message: 'haha haah'},
//   { from_user_id: '376f638d-0b12-4611-9239-6e2940548809', from_chatroom_id: 2, message: 'here I am'},
// )

// If that above routes didnt work, we 404 them and forward to error handler

module.exports = app;
module.exports.handler = serverless(app);