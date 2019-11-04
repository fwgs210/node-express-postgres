const db = require('../../models')
const bcrypt = require('bcryptjs')

const comparePassword = (password, hash) => password === hash || bcrypt.compare(password, hash)

const findUserByEmail = email => db.User.findOne({
    where: {
        email
    },
    include: [ { model: db.Role, as: 'access_level' } ]
})

const login = async (username, password) => {
    const user = await db.User.findOne({
        where: {
            username
        },
        include: [ { model: db.Role, as: 'access_level' } ]
    })
    const isMatch = await comparePassword(password, user.password)

    if(user && isMatch) {
        return user
    }

    return null
}

const findUserByIdAndUpdatePassword = (id, password) => db.User.update(
    { password }, /* set attributes' value */
    { where: { id }} /* where criteria */
)


const findUserById = id => db.User.findOne({
    where: {
        id
    },
    include: [ { model: db.Role, as: 'access_level' } ]
})

// const updateUserPosts = (id, newPost) => User.findByIdAndUpdate(id, { $push: { posts: newPost } })

const registerUser = async body => {

    // return await user.save()
    const user = await db.User.create({ username: body.username, password: body.password, email:body.email, role_level: 2 })

    return user
}

module.exports = {
    findUserByEmail,
    findUserById,
    findUserByIdAndUpdatePassword,
    registerUser,
    login
}