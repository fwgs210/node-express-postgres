const Category = require('../models/category')

const findACategory = categoryName => Category.findOne({ title: categoryName})

const createCategory = async categoryName => {
    const newCat = await new Category({title: categoryName})
    return await newCat.save()
}

module.exports = {
    findACategory,
    createCategory
}