const db = require('../models')

db.sequelize
  .authenticate()
  .then(() => syncTables())
  .then(() => {
    console.log('Connection has been established successfully.');
    loadSampleData()
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

async function loadSampleData () {
    try {

        await db.Role.create({id: 1, permission_level: 10, permission_type: 'administrator'})
        await db.Role.create({id: 2, permission_level: 1, permission_type: 'member'})
    
        await db.User.create({ id: 'c9db4c07-14ac-4430-8001-a0548b41d2b1', username: 'fwgs210', password: '87532998', email:'test@test1.com', role_level: 1 })
        await db.User.create({ id: '1efca9ad-97f6-484c-8088-41dd0c5b03eb', username: 'fwgs220', password: '87532998', email:'test@test2.com', role_level: 2 })
        await db.User.create({ id: '5af54a2f-fc90-4772-b3a3-8b8db08ab113', username: 'fwgs230', password: '87532998', email:'test@test3.com', role_level: 2 })
    
        await db.Chatroom.create({id: 1, room_name: 'room 1'})
        await db.UsersToChatrooms.create({ chatroomId: 1, userId: 'c9db4c07-14ac-4430-8001-a0548b41d2b1' })
        await db.UsersToChatrooms.create({ chatroomId: 1, userId: '1efca9ad-97f6-484c-8088-41dd0c5b03eb' })
    
        await db.Chatroom.create({id: 2, room_name: 'room 2'})
        await db.UsersToChatrooms.create({ chatroomId: 2, userId: '5af54a2f-fc90-4772-b3a3-8b8db08ab113' })
    
        await db.Chat.create({ from_user_id: 'c9db4c07-14ac-4430-8001-a0548b41d2b1', chatroom_id: 1, message: 'test content'})
        await db.Chat.create({ from_user_id: '1efca9ad-97f6-484c-8088-41dd0c5b03eb', chatroom_id: 1, message: 'haha haah'})
        await db.Chat.create({ from_user_id: '5af54a2f-fc90-4772-b3a3-8b8db08ab113', chatroom_id: 2, message: 'here I am'})

        await db.Category.create({ id: 1, category_name: 'test category'})

        await db.Post.create({ 
            user_id: 'c9db4c07-14ac-4430-8001-a0548b41d2b1', 
            id: 'c9db4c07-14ac-4430-8001-a0548b41d2ab',
            category_id: 1,
            content: 'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century',
            title: 'Post 1',
            slug: 'post-1',
            feature_img: 'https://via.placeholder.com/300x200'
        })

        await db.Post.create({ 
            user_id: 'c9db4c07-14ac-4430-8001-a0548b41d2b1', 
            category_id: 1,
            content: 'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century',
            title: 'Post 2',
            slug: 'post-2',
            feature_img: 'https://via.placeholder.com/300x200'
        })


        await db.Comment.create({ 
            user_id: 'c9db4c07-14ac-4430-8001-a0548b41d2b1', 
            rating: 5,
            post_id: 'c9db4c07-14ac-4430-8001-a0548b41d2ab',
            text: 'this is a comment!'
        })

        console.log('Mock data successfully imported')
        process.exit();
    } catch(err) {
        console.log('Error import data!')
        console.log(err)
        process.exit();
    }
}

async function syncTables () {
    if(process.argv.includes('--sync')) {
        // await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
        await db.sequelize.sync({ force: true })
        return console.log('All tables synced! Ready to go!')
    } else {
        return null
    }
}