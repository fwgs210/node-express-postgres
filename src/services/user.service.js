const User = require('../models/user')

const findUserByEmail = email => User.findOne({ email })

module.exports = {
    findUserByEmail
}