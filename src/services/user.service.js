const User = require('../models/User')

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

const registerUser = async body => {
    const {
        username, password, email
    } = body

    const user = new User({ username, password, email })

    return await user.save()
}

module.exports = {
    findUserByEmail,
    findUserById,
    findUserByIdAndUpdatePassword,
    updateUserPosts,
    registerUser,
    login
}