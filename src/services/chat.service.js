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
    include: [ { model: db.Chat, as: 'chatroom_chats' } ], // it is like a virtual field
    order: [
        ['created_at', 'DESC'],
    ],
    limit: 50
})

const findUserChatrooms = userId => db.User.findOne({
    where: {
        id: userId
    },
    include: [ { model: db.Chatroom, as: 'chatrooms' } ], // it is like a virtual field
    order: [
        ['created_at', 'DESC'],
    ],
    limit: 10
})

module.exports = {
    findAllChatsBetweenUsers,
    findChatroomChats,
    findUserChatrooms
}