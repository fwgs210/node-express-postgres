
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // for use async await

const categorySchema = new mongoose.Schema({
  posts: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: false
  }],
  title: {
    type: String,
    required: 'Your category must have a title!'
  }
})

function autopopulate(next) {
    this.populate('posts');
    next();
}

categorySchema.pre('find', autopopulate);

const Category = mongoose.model('Category', categorySchema)
module.exports = Category