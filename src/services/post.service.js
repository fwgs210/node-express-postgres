const Post = require('../models/post')

const findAllPosts = async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page * limit) - limit;

    // 1. Query the database for a list of all stores
    const posts = await Post
        .find()
        .skip(skip)
        .limit(Number(limit))
        .sort({ publishDate: 'desc' });

    if (!posts.length && skip) {
        res.status(400).json({ message: `Hey! You asked for page ${page}. But that doesn't exist.` })
    }

    return posts;
}

const searchPosts = async query => {
    const posts = await Post
    // first find stores that match
    .find({
      $text: {
        $search: query
      }
    }, {
        matchSearch: { $meta: 'textScore' }
    })
    // the sort them
    .sort({
        matchSearch: { $meta: 'textScore' }
    })
    // limit to only 5 results
    .limit(5);

    return posts
}

const addPost = async req => {
    const newPost = await new Post({
        ...req.body,
        author: req.user._id,
        publishDate: new Date()
    })
    return await newPost.save()
}

const findPostById = id => Post.findById(id)

const findPostByIdAndUpdate = (id, query) => Post.findById(id, query)

const deletePostById = id => Post.findByIdAndRemove(id)

const deleteUserPosts = id => Post.deleteMany({ 'author._id': id })

module.exports = {
    findAllPosts,
    searchPosts,
    addPost,
    findPostById,
    findPostByIdAndUpdate,
    deleteUserPosts,
    deletePostById
}