const User = require('../models/user')

const findUserByEmail = email => User.findOne({ email })

const findUserByIdAndUpdatePassword = (id, password) => User.findByIdAndUpdate(id, { password }, { new: true })// set new true to get the updated content

module.exports = {
    findUserByEmail,
    findUserByIdAndUpdatePassword
}