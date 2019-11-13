const { sequelize } = require('./models')

module.exports = {
    connectDB () {
        beforeAll(() => {
            return new Promise((resolve, reject) => {
                sequelize
                .authenticate()
                .then(() => {
                    resolve(console.log('Connection has been established successfully.'))
                })
                .catch(err => {
                    reject(console.error('Unable to connect to the database:', err))
                });
            });
        });
    }
}