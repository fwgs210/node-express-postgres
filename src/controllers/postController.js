const postService = require('../services/post.service')
const Post = require('../models/post')

module.exports.findPopularPosts =  async (req, res) => {
    try {
        const posts = await postService.getPopularPosts()
        res.status(200).json({ data: { posts } })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports.findAllPosts = async (req, res) => {
    try {
        const posts = await postService.findAllPosts(req, res)
        res.status(200).json({ data: { posts } })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports.findUserPosts = async (req, res) => {
    try {
        if(req.user.id.toString() !== req.params.userId.toString()) {
            return res.status(403).json({
                message: "Token not match with user ID!"
            })
        }
        const posts = await Post.find({
            id: { $in: req.user.posts }
        });
        res.status(200).json({ data: { posts } })
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports.searchPosts = async (req, res) => {
    try {
        const posts = await postService.searchPosts(req.query.q)
        res.status(200).json({ data: { posts } })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports.createNewPost = async (req, res) => {
    try {
        if(req.body.slug && req.body.slug.indexOf('/') > -1) {
            res.status(400).json({ message: 'slug can not contain /.' })
        }

        await postService.addPost(req)
        res.status(200).json({ message: "Post created." })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports.editPost = async (req, res) => {
    try {
        const post = await postService.findPostById(req.params.id)
        if(!post.user_id.toString() !== req.user.id && req.user.role < 10) {
            res.status(403).json({ message: `You don't have acccess for this action.` })
        } else {
            await postService.findPostByIdAndUpdate(req.params.id, req.body)
            res.status(200).json({ message: 'Post updated.' })
        }
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports.deletePost = async (req, res) => {
    try {
        const post = await postService.findPostById(req.params.id)
        if(!post.user_id.toString() !== req.user.id && req.user.role < 10) {
            res.status(403).json({ message: `You don't have acccess for this action.` })
        } else {
            const deletePost = await postService.deletePostById(req.params.id)
            res.status(200).json({ message: `${deletePost.title} is deleted` })
        }
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
}