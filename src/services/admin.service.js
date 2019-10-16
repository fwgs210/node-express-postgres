const User = require('../models/User')

const findAllusers = () => User.find().select({ password: 0 })

const updateUser = (id, user) =>  User.findOneAndUpdate({_id: id}, user, { new: true })

const deleteUser = id => User.findByIdAndRemove(id)

module.exports = {
    findAllusers,
    updateUser,
    deleteUser
}