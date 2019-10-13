const { verify, sign, signRefreshToken } = require('../utils/tokenService');
const userService = require('../services/user.service')

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await userService.login(username, password);
        if (!user) {
            res.status(403).json({
                message: "User not exists!"
            })
        }
        const token = await sign({ 
            id: user._id,
            username: user.username,
            email: user.email
        });
        
        const refreshToken = await signRefreshToken({ 
            id: user._id,
            username: user.username,
            email: user.email
        });

        req.token = token
        req.refreshToken = refreshToken

        next()
    } catch (e) {
        res.status(403).json({
            message: "Unauthorized!",
            error: e
        })
        return null
    }
}

// module.exports = async (req, res, next) => {
//     const bearerHeader = req.headers['authorization'];
//     if (!bearerHeader) {
//         res.status(403).json({
//             message: "Unauthorized!"
//         })
//         return null
//     }

//     try {
//         const bearerToken = bearerHeader.split(' ')[1]
//         const decoded = await verify(bearerToken)
//         req.token = decoded
//         next()
//     } catch (e) {
//         res.status(403).json({
//             message: "Unauthorized!",
//             error: e
//         })
//         return null
//     }
// }
