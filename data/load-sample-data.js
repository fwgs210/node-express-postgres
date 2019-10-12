const fs = require('fs');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blogposts',{ useNewUrlParser: true });
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises

// import all of our models - they need to be imported only once
const User = require('../src/models/user');
const Post = require('../src/models/post');
const Category = require('../src/models/category');


// const posts = JSON.parse(fs.readFileSync(__dirname + '/posts.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync(__dirname + '/users.json', 'utf-8'));
const posts = JSON.parse(fs.readFileSync(__dirname + '/posts.json', 'utf-8'));
const categories = JSON.parse(fs.readFileSync(__dirname + '/categories.json', 'utf-8'));

async function deleteData() {
  console.log('😢😢 Goodbye Data...');
  await Post.remove();
  await User.remove();
  await Category.remove();
  console.log('Data Deleted. To load sample data, run\n\n\t npm run sample\n\n');
  process.exit();
}

async function loadData() {
  try {
    await Post.insertMany(posts);
    await User.insertMany(users);
    await Category.insertMany(categories);
    console.log('👍👍👍👍👍👍👍👍 Done!');
    process.exit();
  } catch(e) {
    console.log('\n👎👎👎👎👎👎👎👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n');
    console.log(e);
    process.exit();
  }
}
if (process.argv.includes('--delete')) {
  deleteData();
} else {
  loadData();
}