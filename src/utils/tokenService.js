const jwt = require('jsonwebtoken')
const { key, refreshKey } = require('../config/serverSetup')

module.exports.verify = token => jwt.verify(token, key)
module.exports.sign = data => jwt.sign(data, key)
module.exports.signRefreshToken = data => jwt.sign(data, refreshKey)
module.exports.verifyRefreshToken = token => jwt.verify(token, refreshKey)
