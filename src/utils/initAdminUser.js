const User = require('../models/user')
const mongoose = require('mongoose')

module.exports = async () => {
    const adminExist = await User.findOne({ username: 'admin' });
    if (!adminExist) {
        const admin = new User({
            username: 'admin',
            password: '87532998',
            email: 'info@tracysu.com',
            role: 'administrator',
            id: new mongoose.Types.ObjectId()
        })
        admin.save()
    }
}