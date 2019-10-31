const chatService = require('../services/chat.service')

module.exports.getChatroomChats = async (req, res) => {
    try {
        const chats = await chatService.findChatroomChats(req.params.chatroomId)
        res.status(200).json({ data: { chatroom: chats } })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports.getUserChatrooms = async (req, res) => {
    try {
        const chatrooms = await chatService.findUserChatrooms(req.params.userId)
        res.status(200).json({ data: { chatrooms } })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}