
const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const Schema = mongoose.Schema
mongoose.Promise = global.Promise; // for use async await

const commentSchema = new Schema({
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply an author!'
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: 'You must supply an article!'
    },
    text: {
        type: String,
        required: 'Your review must have text!'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    }
})

function autopopulate(next) {
    this.populate('author', '-password -posts -email -role');
    next();
}

commentSchema.pre('find', autopopulate);
commentSchema.pre('findOne', autopopulate);

commentSchema.plugin(mongodbErrorHandler);

const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment