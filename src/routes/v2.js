const express = require('express')
const passport    = require('passport');
const router = express.Router()
const chatController = require('../controllers/chatController')

router.route('/')
    .get((req, res) => res.send('api v2 is up'))

// post router
router.route('/chatroom/:chatroomId')
    .get(chatController.getChatroomChats)

router.route('/chatroom/user/:userId').get(
    chatController.getUserChatrooms
)

router.route('/chatroom/create').post(
    passport.authenticate('jwt', {session: false}),
    chatController.createChatroom
)

router.route('/chatroom/chat').post(
    // passport.authenticate('jwt', {session: false}), 
    chatController.createChat
)

module.exports = router