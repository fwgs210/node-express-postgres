const User = require('../models/user')
const db = require('../../models')
const bcrypt = require('bcryptjs')

const comparePassword = (password, hash) => bcrypt.compare(password, hash)

const findUserByEmail = email => User.findOne({ email })

const login = async (username, password) => {
    const user = await db.User.findOne({
        where: {
            username: username
        }
    })
    const isMatch = await comparePassword(password, user.password)

    if(user && isMatch) {
        return user
    }

    return null
}

const findUserByIdAndUpdatePassword = (id, password) => User.findByIdAndUpdate(id, { password }, { new: true })// set new true to get the updated content

const findUserById = id => User.findById(id)

const updateUserPosts = (id, newPost) => User.findByIdAndUpdate(id, { $push: { posts: newPost } })

const registerUser = async body => {

    // return await user.save()
    const user = await db.User.create({ username: body.username, password: body.password, email:body.email, role_level: 1 })

    return user
}

module.exports = {
    findUserByEmail,
    findUserById,
    findUserByIdAndUpdatePassword,
    updateUserPosts,
    registerUser,
    login
}