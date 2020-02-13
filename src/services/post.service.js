const db = require('../../models')

const findAllPosts = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page * limit) - limit;

        const models = await db.connectToDatabase()
        const posts = await models.Post.findAll({
            offset: skip,
            limit,
            order: [
                ['created_at', 'DESC'],
            ],
            include: [ 
                { model: models.User, as: 'author' }, 
                { 
                    model: models.Comment, 
                    as: 'comments',
                    attributes: ['rating', 'text'],
                    include: [{model: models.User, attributes: ['username']}]
                } 
            ]
        })

        if (!posts.length && skip) {
            res.status(400).json({ message: `Hey! You asked for page ${page}. But that doesn't exist.` })
        }

        return posts;
    } catch(err) {
        return res.status(500).json({ message: err.message })
    }
}

const searchPosts = async query => {
    const posts = await db.sequelize.query('SELECT * FROM Posts WHERE Posts.title LIKE "%":q"%" OR Posts.content LIKE "%":q"%" LIMIT 5', {
        replacements: {q: query},
        type: db.sequelize.QueryTypes.SELECT
    });

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

const findPostByUserId = userId => db.Post.findAll({
    where: {
        user_id: userId
    },
    limit: 10
})

const findPostByIdAndUpdate = (id, query) => db.Post.update(query, {
    where: { id } 
})

const deletePostById = id => db.Post.destroy({ where: { id }})

const deleteUserPosts = id => db.Post.destroy({ where: { user_id: id }})

const getPopularPosts = async () => {
    query = `SELECT 
        i.id, 
        i.title, 
        i.slug, 
        (SELECT AVG(rating)
            FROM Comments 
            WHERE post_id = i.id
        ) as reviews
        FROM Posts i
        ORDER BY reviews DESC
        LIMIT 5;`

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
    getPopularPosts,
    findPostByUserId
}