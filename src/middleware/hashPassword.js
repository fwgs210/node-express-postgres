const bcrypt = require('bcryptjs')

module.exports = async (req, res, next) => {
    if(req.body.password) {
        const hash = await bcrypt.hash(req.body.password, 10)
        req.body.password = hash
        next()
    } else {
        next()
    }
}
