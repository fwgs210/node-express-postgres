const jwt = require('jsonwebtoken')
const { key } = require('../config/serverSetup')

module.exports.verify = token => jwt.verify(token, key)
module.exports.sign = data => jwt.sign(data, key)