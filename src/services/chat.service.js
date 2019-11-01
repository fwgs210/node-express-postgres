const db = require('../../models')

const findAllChatsBetweenUsers = async (userOneId, userTwoId) => {
    const query = `SELECT * FROM Chats 
        WHERE (Posts.from_user_id = :userOneId AND Posts.to_user_id = :userTwoId)
        OR (Posts.from_user_id = :userTwoId AND Posts.to_user_id = :userOneId)
        ORDER BY created_at DESC
        LIMIT 50`

    const chats = await db.sequelize.query(query, {
        replacements: {
            userOne: userOneId,
            userTwo: userTwoId
        },
        type: db.sequelize.QueryTypes.SELECT
    });

    return chats
}

const findChatroomChats = roomId => db.Chatroom.findOne({
    where: {
        id: roomId
    },
    include: [ { 
        model: db.Chat, 
        as: 'chatroom_chats', 
        attributes: ['message'],
        include: [{ model: db.User, as: 'from_user', attributes: ['username'] }] 
    } ], // it is like a virtual field
    order: [
        ['created_at', 'DESC'],
    ],
    limit: 50
})

// Get all chatrooms for this user
const findUserChatrooms = async id => {
    const user = await db.User.findOne({
        where: {
            id
        }
    })

    return await user.getChatrooms({
        order: [
            ['created_at', 'DESC'],
        ],
        limit: 50
    })
// findAll({
//     where: {
//         id: userId
//     },
//     // Make sure to include the products
//     include: [{
//         model: db.Chatroom,
//         as: 'chatrooms',
//         required: false
//     }],
// });
}

const findUserInChatroom = async (user_id, chatroom_id) => {
    const query = `SELECT * FROM users_to_chatrooms 
        WHERE user_id = :userId AND chatroom_id = :chatroomId
        LIMIT 1`

    const userIn = await db.sequelize.query(query, {
        replacements: {
            userId: user_id,
            chatroomId: chatroom_id
        },
        type: db.sequelize.QueryTypes.SELECT
    });

    return userIn

}

const createChatroom = data => db.Chatroom.create(data)

const createChat = data => db.Chat.create(data)

const createUsersToChatroomsTable = data => db.UsersToChatrooms.create(data)

module.exports = {
    findAllChatsBetweenUsers,
    findChatroomChats,
    findUserChatrooms,
    createChatroom,
    createUsersToChatroomsTable,
    createChat,
    findUserInChatroom
}