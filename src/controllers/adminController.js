const adminService = require('../services/admin.service')
const postService = require('../services/post.service')

module.exports.getAllusers = async (req, res) => {
    try {
        const users = await adminService.findAllusers()
        if (users) {
            res.status(200).json({ data: { users } })
        } else {
            res.status(203).json({ message: 'No user found' })
        }
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports.updateUser = async (req, res) => {

    try {
        const updatedUser = await adminService.updateUser(req.params.userId, req.body)
        res.status(200).json({ message: `${updatedUser.username}'s profile is updated` })

    } catch(err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports.deleteUser = async (req, res) => {

    try {
        const deleteUser = await adminService.deleteUser(req.params.userId)
        const deleteUserPosts = await postService.deleteUserPosts(req.params.userId)

        if(!deleteUser || !deleteUserPosts) {
            return res.status(422).json({message: "Error deleting posts or user"})
        }

        res.status(200).json({ message: `${deleteUser.username}'s profile is deleted` })
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
}