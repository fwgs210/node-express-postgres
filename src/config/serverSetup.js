// This is the config for production
module.exports.PORT = process.env.PORT || 3000
module.exports.key = "tracy su"
// module.exports.uri = process.env.MONGODB_URI || 'mongodb://localhost/blogApp'
module.exports.uri = process.env.NODE_ENV !== 'production' ? 'mongodb://localhost/blogposts' : "mongodb+srv://fwgs210:Asddhjkl110@@cluster0-rpulb.mongodb.net/test?retryWrites=true"