const mongoose = require('mongoose');
const Category = mongoose.model('Category');

const findACategory = categoryName => Category.findOne({ title: categoryName})

const createCategory = async categoryName => {
    const newCat = await new Category({title: categoryName})
    return await newCat.save()
}

module.exports = {
    findACategory,
    createCategory
}