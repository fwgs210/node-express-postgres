const Post = require('../models/post')

const findAllPosts = () => Post.find()

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

module.exports = {
    findAllPosts,
    searchPosts
}