const express = require('express')
const passport    = require('passport');
const router = express.Router()
require('../models/Category')
require('../models/User')
require('../models/Post')
const postController = require('../controllers/postController')
const adminController = require('../controllers/adminController')
const authController = require('../controllers/authController')
const jwt = require('../middleware/auth')
const hashPassword = require('../middleware/hashPassword')

router.route('/')
    .get((req, res) => res.send('api v1 is up'))


// post router
router.route('/posts')
    .get(postController.findAllPosts)

router.route('/posts/search')
    .get(postController.searchPosts)
    
router.route('/posts/create')
    .post(
        passport.authenticate('jwt', {session: false}), 
        postController.addCategory,
        postController.createNewPost
    )

router.route('/posts/update/:id').put(
    passport.authenticate('jwt', {session: false}), 
    postController.editPost
)

router.route('/posts/user/:userId').get(
    passport.authenticate('jwt', {session: false}),
    postController.findUserPosts
)

router.route('/posts/delete/:id').delete(
    passport.authenticate('jwt', {session: false}),
    postController.deletePost
)

// user router
router.route('/user/change-password').post(
    passport.authenticate('jwt', {session: false}), 
    hashPassword,
    authController.updateUserPassword
)

router.route('/user/password-reset').post(authController.reset);

router.route('/user/register').post(
    authController.register,
    jwt.login,
    authController.login
)

router.route('/user/login').post(
    jwt.login,
    authController.login
)


// // admin routes
router.route('/users').get(
    passport.authenticate('jwt', {session: false}), 
    jwt.authorization,
    adminController.getAllusers
)

router.route('/users/update/:userId')
    .post(
        passport.authenticate('jwt', {session: false}),
        jwt.authorization,
        hashPassword,
        adminController.updateUser
    )

router.route('/users/delete/:userId')
    .delete(
        passport.authenticate('jwt', {session: false}),
        jwt.authorization,
        adminController.deleteUser
    )

module.exports = router