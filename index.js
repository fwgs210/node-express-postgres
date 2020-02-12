// const app = require('./src/app');
// const { sequelize } = require('./models')
// const { PORT } = require('./src/config/serverSetup')

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//     app.listen(PORT, err => {
//         if (err) throw err;
//         console.log(`✅  Server is up and running on port ${PORT}.`)
//     })
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

// module.exports = sequelize

'use strict'
const awsServerlessExpress = require('aws-serverless-express')

const app = require('./src/app');
const { sequelize } = require('./models')
const { PORT } = require('./src/config/serverSetup')

sequelize
  .authenticate()
  .then(() => {
    // console.log('Connection has been established successfully.');
    // app.listen(PORT, err => {
    //     if (err) throw err;
    //     console.log(`✅  Server is up and running on port ${PORT}.`)
    // })
    const server = awsServerlessExpress.createServer(app)
    module.exports.handler = (event, context) => { awsServerlessExpress.proxy(server, event, context) }
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize