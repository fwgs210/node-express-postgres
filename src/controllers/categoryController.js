const categoryService = require('../services/category.service')

module.exports.addCategory = async (req, res, next) => {
    try {
        const categoryName = req.body.category.trim().toLowerCase().replace(/\s+/g, '-')
        const existCategory = await categoryService.findACategory(categoryName)
        const category = existCategory ? existCategory : await categoryService.createCategory(categoryName)
        req.body.category_id = category.id
        next();
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
