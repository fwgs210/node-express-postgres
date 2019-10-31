const express = require('express')
const passport    = require('passport');
const router = express.Router()
const chatController = require('../controllers/chatController')
const categoryController = require('../controllers/categoryController')
const adminController = require('../controllers/adminController')
const authController = require('../controllers/authController')
const jwt = require('../middleware/auth')
const hashPassword = require('../middleware/hashPassword')

router.route('/')
    .get((req, res) => res.send('api v2 is up'))

// post router
router.route('/chatroom/:chatroomId')
    .get(chatController.getChatroomChats)

router.route('/chatroom/user/:userId')
    .get(chatController.getUserChatrooms)

router.route('/chatroom/create')
    .post(chatController.createChatroom)

router.route('/chatroom/chat')
    .post(chatController.createChat)

module.exports = router