const app = require('./src/app');
const { sequelize } = require('./models')
const { PORT } = require('./src/config/serverSetup')

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    app.listen(PORT, err => {
        if (err) throw err;
        console.log(`✅  Server is up and running on port ${PORT}.`)
    })
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize