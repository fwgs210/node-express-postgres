const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    featureImg: { type: String, required: false },
    author: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: 'You must supply an author' 
    },
    title: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    publishDate: { type: String, required: true },
    comments: { type: Array, required: false },
    tags: { type: Array, required: false },
    categories: { type: Array, required: false }
})

function autopopulate(next) {
    this.populate('author', '-password -posts');
    next();
  }
  
// Define our indexes
postSchema.index({
    author: 'text',
    title: 'text',
    content: 'text'
});

postSchema.pre('find', autopopulate);
postSchema.pre('findOne', autopopulate);


const Post = mongoose.model('Post', postSchema)

module.exports = Post