const postService = require('../services/post.service')
const userService = require('../services/user.service')
const categoryService = require('../services/category.service')
const Post = require('../models/Post')

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
        if(req.user._id.toString() !== req.params.userId.toString()) {
            return res.status(403).json({
                message: "Token not match with user ID!"
            })
        }
        const posts = await Post.find({
            _id: { $in: req.user.posts }
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

        const newPost = await postService.addPost(req)
        await userService.updateUserPosts(req.user._id, newPost)
        res.status(200).json({ message: "Post created." })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports.addCategory = async (req, res, next) => {
    try {
        const categoryName = req.body.category.trim().toLowerCase().replace(/\s+/g, '')
        const existCategory = await categoryService.findACategory(categoryName)
        const category = existCategory ? existCategory : await categoryService.createCategory(categoryName)
        req.body.category = category._id
        next();
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports.editPost = async (req, res) => {
    try {
        const post = await postService.findPostById(req.params.id)
        if(!post.author.equals(req.user._id) && req.user.role !== 'administrator') {
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
        if(!post.author.equals(req.user._id) && req.user.role !== 'administrator') {
            res.status(403).json({ message: `You don't have acccess for this action.` })
        } else {
            const deletePost = await postService.deletePostById(req.params.id)
            res.status(200).json({ message: `${deletePost.title} is deleted` })
        }
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
}