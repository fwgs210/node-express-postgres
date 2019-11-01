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

        const userInChatroom = await chatService.findUserInChatroom(req.body.from_user_id, req.body.chatroom_id)

        if(userInChatroom.length > 0) { // in chatroom already
            await chatService.createChat(req.body);
            return res.status(200).json({ message: 'chat added.' })
        } else {
            // Search for the user with the givenId and make sure it exists. If it doesn't, respond with status 400.
            const user = await userService.findUserById(req.body.from_user_id);

            if (!user) {
                return res.status(400).json({ message: `id:${req.body.from_user_id} does not exist in the database` });
            }
            const addUserChatroom = {
                chatroomId: req.body.chatroom_id,
                userId: req.body.from_user_id
            }
        
            // Create and save a userChatrooms
            await chatService.createUsersToChatroomsTable(addUserChatroom);
            await chatService.createChat(req.body);
            return res.status(200).json({ message: 'chat and chatroom added.' })
        }
        
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