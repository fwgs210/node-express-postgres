const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const Schema = mongoose.Schema
mongoose.Promise = global.Promise; // for use async await

const userSchema = new Schema({
    username: { 
        type: String, 
        required: 'Please Supply an username', 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    password: { 
        type: String, 
        required: 'Please Supply a password',
        trim: true
    },
    email: { 
        type: String, 
        unique: true, 
        lowercase: true, 
        trim: true,
        validate: [validator.isEmail, 'Invalid Email Address'],
        required: 'Please Supply an email address'
    },
    role: {
        type: String,
        required: true,
        enum: ['member', 'editor', 'administrator'],
        default: 'member'
    },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    resetPasswordToken: String,
    resetPasswordExpires: Date
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

userSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
      next(new Error('There was a duplicate key error'));
    } else {
      next();
    }
});

// function autopopulate(next) {
//     this.populate('posts');
//     next();
//   }

// userSchema.pre('findOne', autopopulate);
// userSchema.pre('findById', autopopulate);
userSchema.plugin(mongodbErrorHandler);

const User = mongoose.model('User', userSchema)

module.exports = User