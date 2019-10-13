const User = require('../models/user')

const findUserByEmail = email => User.findOne({ email })

const login = async (username, password) => {
    const user = await User.findOne({ username })
    if(user && user.comparePassword(password)) {
        return user
    }

    return null
}

const findUserByIdAndUpdatePassword = (id, password) => User.findByIdAndUpdate(id, { password }, { new: true })// set new true to get the updated content

const findUserById = id => User.findById(id)

const updateUserPosts = (id, newPost) => User.findByIdAndUpdate(id, { $push: { posts: newPost } })

module.exports = {
    findUserByEmail,
    findUserById,
    findUserByIdAndUpdatePassword,
    updateUserPosts,
    login
}