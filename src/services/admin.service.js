const db = require('../../models')

const findAllusers = () => db.User.findAll({
    include: [ { model: db.Role, as: 'access_level' } ], // it is like a virtual field
    order: [
        ['created_at', 'DESC'],
    ]
})

// const findAllusersHavePosts = () => User.find({ 'posts.0': { $exists: true } }).select({ password: 0 })

const updateUser = (id, query) =>  db.User.update(query, {
    where: { id } 
})

const deleteUser = id => db.User.destroy({ where: { id }})

module.exports = {
    findAllusers,
    updateUser,
    deleteUser
}