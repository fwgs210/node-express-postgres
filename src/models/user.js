const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Post = require('./post')
const Schema = mongoose.Schema

const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
        type: String,
        required: true,
        enum: ['member', 'editor', 'administrator'],
        default: 'member'
    },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
})

// before a new user is saved
userSchema.pre('save', async function (next) {
    const user = this
    // if the user's password has changed since the last time the user was saved, or if this is a completely new user
    if (user.isModified('password') || user.isNew) {
        try {
            // hash their password
            const hash = await bcrypt.hash(user.password, 10)
            // set their password to be equal to the hash
            user.password = hash
            next()
        } catch (e) {
            next(e)
        }
    } else {
        return next()
    }
})

userSchema.methods.comparePassword = function(password) {
  // use bcrypt to compare a plaintext password to a hash
  return bcrypt.compare(password, this.password);
};

function autopopulate(next) {
    this.populate('posts');
    next();
  }

// userSchema.pre('find', autopopulate);
// userSchema.pre('findOne', autopopulate);
// userSchema.pre('findById', autopopulate);

const User = mongoose.model('User', userSchema)

module.exports = User