const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise; // for use async await

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
    tags: { type: Array, required: false },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: 'your post must have a category' }
})

function autopopulate(next) {
    this.populate('author', '-password -posts').populate('category');
    next();
}
  
// Define our indexes
postSchema.index({
    author: 'text',
    title: 'text',
    content: 'text',
    slug: 'text'
});

postSchema.pre('find', autopopulate);
postSchema.pre('findOne', autopopulate);


const Post = mongoose.model('Post', postSchema)

module.exports = Post