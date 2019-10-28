const db = require('../../models')

const findAllPosts = async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page * limit) - limit;

    const posts = await db.Post.findAll({
        offset: skip,
        limit,
        order: [
            ['created_at', 'DESC'],
        ]
    })

    if (!posts.length && skip) {
        res.status(400).json({ message: `Hey! You asked for page ${page}. But that doesn't exist.` })
    }

    return posts;
}

const searchPosts = async query => {
    const posts = await db.sequelize.query('SELECT * FROM Posts WHERE Posts.title LIKE "%":q"%" OR Posts.content LIKE "%":q"%" LIMIT 5', {
        replacements: {q: query},
        type: db.sequelize.QueryTypes.SELECT
    });

    // const posts = await Post
    // // first find stores that match
    // .find({
    //   $text: {
    //     $search: query
    //   }
    // }, {
    //     matchSearch: { $meta: 'textScore' }
    // })
    // // the sort them
    // .sort({
    //     matchSearch: { $meta: 'textScore' }
    // })
    // // limit to only 5 results
    // .limit(5);

    return posts
}

const addPost = async req => {
    req.body.slug = req.body.slug.startsWith('/') ? req.body.slug : `/${req.body.slug}`
    const newPost = await db.Post.create({
        ...req.body,
        user_id: req.user.id
    })
    return newPost
}

const findPostById = id => db.Post.findOne({
    where: {
        id
    }
})

const findPostByIdAndUpdate = (id, query) => db.Post.update(query, {
    where: { id } 
})

const deletePostById = id => db.Post.destroy({ where: { id }})

const deleteUserPosts = id => db.Post.destroy({ where: { user_id: id }})

const getPopularPosts = async () => {
    query = `SELECT Posts.OrderID, Posts.CustomerName
    FROM Orders
    INNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID; LIMIT 5`

    const posts = await db.sequelize.query(query, {
        type: db.sequelize.QueryTypes.SELECT
    });

    return posts
}

module.exports = {
    findAllPosts,
    searchPosts,
    addPost,
    findPostById,
    findPostByIdAndUpdate,
    deleteUserPosts,
    deletePostById,
    getPopularPosts
}