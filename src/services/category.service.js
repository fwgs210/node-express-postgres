const db = require('../../models')

const findACategory = categoryName => db.Category.findOne({
    where: {
        category_name: categoryName
    }
})

const createCategory = categoryName => db.Category.create({category_name: categoryName})

module.exports = {
    findACategory,
    createCategory
}