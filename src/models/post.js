const mongoose = require('mongoose')
const mongodbErrorHandler = require('mongoose-mongodb-errors');
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
    tags: [String],
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: 'your post must have a category' }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

postSchema.statics.getTopPosts = function() {
    return this.aggregate([
      // Lookup Stores and populate their reviews
      { $lookup: { from: 'comments', localField: 'id', foreignField: 'postId', as: 'reviews' }},
      // filter for only items that have 2 or more reviews
      { $match: { 'reviews.1': { $exists: true } } },
      // Add the average reviews field
      { $project: {
        featureImg: '$$ROOT.featureImg',
        title: '$$ROOT.title',
        reviews: '$$ROOT.reviews',
        slug: '$$ROOT.slug',
        averageRating: { $avg: '$reviews.rating' }
      } },
      // sort it by our new field, highest reviews first
      { $sort: { averageRating: -1 }},
      // limit to at most 10
      { $limit: 10 }
    ]);
  }

// find reviews where the stores id property === reviews store property
postSchema.virtual('comments', {
    ref: 'Comment', // what model to link?
    localField: 'id', // which field on the store?
    foreignField: 'postId' // which field on the review?
});

function autopopulate(next) {
    this.populate('author', '-password -posts -email -role').populate('category').populate('comments');
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
postSchema.post('save', (error, doc, next) => {
    if (error.name === 'MongoError' && error.code === 11000) {
      next(new Error('There was a duplicate key error'));
    } else {
      next();
    }
});

postSchema.statics.getTagsList = function() {
    return this.aggregate([
      { $unwind: '$tags' },
      { $group: { name: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
};

postSchema.plugin(mongodbErrorHandler);
const Post = mongoose.model('Post', postSchema)

module.exports = Post