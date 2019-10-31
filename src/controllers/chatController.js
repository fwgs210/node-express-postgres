const chatService = require('../services/chat.service')
const userService = require('../services/user.service')

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

module.exports.createChat = async (req, res) => {
    try {
        if(!req.body.message || !req.body.from_user_id || !req.body.chatroom_id) return res.statu(400).json({ message: 'required data not provided.' })
        await chatService.createChat(req.body);
        res.status(200).json({ message: 'chat added.' })
        
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports.createChatroom = async (req, res) => {
    try {
        // create a chatroom
        const chatroom = await chatService.createChatroom(req.body);
        
        // Loop through all the items in req.users
        await req.body.users.forEach(async (userToAdd) => {
            try {
                // Search for the user with the givenId and make sure it exists. If it doesn't, respond with status 400.
                const user = await userService.findUserById(userToAdd.id);
                if (!user) {
                    return res.status(400).json({ message: `id:${userId} does not exist in the database` });
                }
                console.log(user.id, 'user here')
                // Create a dictionary with which to create the userChatrooms
                const userChatrooms = {
                    chatroomId: chatroom.id,
                    userId: user.id
                }
            
                // Create and save a userChatrooms
                await chatService.createUsersToChatroomsTable(userChatrooms);
            } catch (err) {
                return res.status(500).json({ message: err.message })
            }
        });
        
        res.status(200).json({ data: { chatroom } })
        
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}