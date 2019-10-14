const { verify, sign, signRefreshToken } = require('../utils/tokenService');
const userService = require('../services/user.service')

module.exports.login = async (req, res, next) => {
    try {
        if(req.headers['authorization']) { // token re-login
            const bearerToken = req.headers['authorization'].split(' ')[1]
            const decoded = await verify(bearerToken)
            req.token = bearerToken
            req.user = {
                id: decoded.id,
                username: decoded.username,
                email: decoded.email
            }
            return next()
        }

        const { username, password } = req.body

        if(!username || !password) {
            return res.status(403).json({
                message: "Please enter your password and username"
            })
        }

        const user = await userService.login(username, password);
        if (!user) {
            return res.status(403).json({
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
        req.user = {
            id: user._id,
            username: user.username,
            email: user.email
        }

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
