const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    featureImg: { type: String, required: false },
    author: { type: Object, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    content: { type: String, required: true },
    publishDate: { type: String, required: true },
    comments: { type: Array, required: false },
    tags: { type: Array, required: false },
    categories: { type: Array, required: false }
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post