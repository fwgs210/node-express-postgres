const postService = require('../services/post.service')

module.exports.findAllPosts = async (req, res) => {
    try {
        const posts = await postService.findAllPosts()
        res.status(200).json({ data: posts })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports.searchPosts = async (req, res) => {
    try {
        const posts = await postService.searchPosts(req.query.q)
        res.status(200).json({ data: posts })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}