const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport    = require('passport');
const router = express.Router()
const User = require('../models/user')
const Post = require('../models/post')
const Catetory = require('../models/category')
const postController = require('../controllers/postController')
const authController = require('../controllers/authController')
const jwt = require('../middleware/auth')
const verifyAdmin = require('../middleware/verifyAdmin')
const { sign } = require('../utils/tokenService')

router.route('/')
    .get((req, res) => res.send('api v1 is up'))

router.route('/password-reset').post(authController.reset);

router.route('/posts')
    .get(postController.findAllPosts)
    
router.route('/posts/create')
    .post(
        passport.authenticate('jwt', {session: false}), 
        postController.addCategory,
        postController.createNewPost
    )

router.route('/posts/search')
    .get(postController.searchPosts)

router.route('/posts/edit/:id').put(
    passport.authenticate('jwt', {session: false}), 
    postController.editPost
)

// router.route('/posts/:user/:postTitle').get((req, res) => {
//     Post
//         .findOne({ slug: `/${req.params.user}/${req.params.postTitle}` })
//         .then(post => {
//             res.status(200).json({ payload: post, message: 'Post found.' })
//         })
//         .catch(err => {
//             res.status(500).json({ message: err.message })
//         })
// })

router.route('/posts/:user').get((req, res) => {
    User
        .findOne({ username: req.params.user })
        .populate({
            path: 'posts'
        })
        .exec((err, foundUser) => {
            if (err) {
                res.status(500).json({ message: err.message })
                return handleError(err)
            }

            res.status(200).json({ payload: foundUser.posts, message: 'token verified.' })
        });
})

// // change password
router.route('/user/change-password').post(
    passport.authenticate('jwt', {session: false}), 
    authController.updateUserPassword
)

// new user
router.route('/register').post(async (req, res) => {
    const { username, password, email } = req.body;

    const userExist = await User.findOne({ username })
    const emailExist = await User.findOne({ email })

    if (userExist) {
        res.status(203).json({ message: 'User already exists' })
    } else if (emailExist) {
        res.status(203).json({ message: 'Email already exists' })
    } else {
        const user = new User({ username, password, email, _id: new mongoose.Types.ObjectId() })
        user
            .save()
            .then(doc => {
                const token = sign({ userInfo: doc });
                res.status(200).json({ user: { _id: doc._id, role: doc.role }, token })
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
})

// // SSO login 
router.route('/login/sso').post( (req, res) => {
    const { username } = req.token.userInfo
    User.findOne({ username })
        .then(doc => {
            if (doc) {
                res.status(200).json({ user: { _id: doc._id, role: doc.role, username: doc.username } })
            } else {
                res.status(203).json({ user: doc, message: 'Authentication failed' })
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
})

// login 
router.route('/login').post(
    jwt.login,
    authController.login
)

router.route('/posts/:id').delete( (req, res) => {
    const { id } = req.params

    Post.findByIdAndRemove(id)
        .then(doc => {
            res.status(200).json({ deleted: doc })
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
})

// // admin API
router.route('/users').get((req, res) => {
    User.find().select({ password: 0 })
        .then(doc => {
            if (doc) {
                res.status(200).json({ data: doc })
            } else {
                res.status(203).json({ message: 'No user found' })
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
})

router.route('/users/:userId')
    .put(verifyAdmin, (req, res) => {
        const { userId } = req.params;
        const { email, role } = req.body

        User.findByIdAndUpdate(userId, { email, role })
            .then(doc => {
                res.status(200).json({ message: `${doc.username}'s profile updated by ${req.token.userInfo.username}` })
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    })
    .delete(verifyAdmin, (req, res) => {
        const { userId } = req.params;

        User.findByIdAndRemove(userId)
            .then(async doc => {
                await Post.deleteMany({ 'author._id': userId });
                res.status(200).json({ message: `${doc.username} is removed` })
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    })
module.exports = router