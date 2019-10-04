const { verify } = require('../utils/tokenService');

module.exports = async (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (!bearerHeader) {
        res.status(403).json({
            message: "Unauthorized!"
        })
        return null
    }

    try {
        const bearerToken = bearerHeader.split(' ')[1]
        const decoded = await verify(bearerToken)

        if (!decoded.userInfo.role === 'administrator') {
            res.status(403).json({
                message: "Unauthorized!"
            })
            return null
        }

        req.token = decoded
        next()
    } catch (e) {
        res.status(403).json({
            message: "Unauthorized!",
            error: e
        })
        return null
    }
}
