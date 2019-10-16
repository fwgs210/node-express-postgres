
const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const Schema = mongoose.Schema
mongoose.Promise = global.Promise; // for use async await

const categorySchema = new Schema({
  posts: [{
    type: Schema.Types.ObjectId,
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
categorySchema.plugin(mongodbErrorHandler);

const Category = mongoose.model('Category', categorySchema)
module.exports = Category