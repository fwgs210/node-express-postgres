const app = require('./src');
const { PORT } = require('./src/config/serverSetup')

app.listen(PORT, err => {
    if (err) throw err;
    console.log(`✅  Server is up and running on port ${PORT}.`)
})