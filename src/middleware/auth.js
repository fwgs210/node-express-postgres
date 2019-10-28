const { verify, sign, signRefreshToken } = require('../utils/tokenService');
const userService = require('../services/user.service')

module.exports.login = async (req, res, next) => {
    try {
        if(req.headers['authorization']) { // token re-login
            const bearerToken = req.headers['authorization'].split(' ')[1]
            const decoded = await verify(bearerToken)

            if(!decoded) {
                return res.status(403).json({
                    message: "Invalid token!"
                })
            }

            const userIdExist = await userService.findUserById(decoded.id)

            if(userIdExist && decoded.username === userIdExist.username) {
                req.token = bearerToken
                req.user = {
                    id: userIdExist.id,
                    username: userIdExist.username,
                    email: userIdExist.email,
                    role: userIdExist.access_level.permission_level
                }
                return next()
            } else {
                return res.status(403).json({
                    message: "User not exists!"
                })
            }
        }

        // normal login

        const { username, password } = req.body

        if(!username || !password) {
            return res.status(403).json({
                message: "Please enter your password and username"
            })
        }
        
        const user = await userService.login(username, password);
        
        if (!user) {
            return res.status(403).json({
                message: "User not exists or password wrong!"
            })
        }

        const token = await sign({ 
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.access_level.permission_level
        });
        
        const refreshToken = await signRefreshToken({ 
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.access_level.permission_level
        });

        req.token = token
        req.refreshToken = refreshToken
        req.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.access_level.permission_level
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

module.exports.authorization = async (req, res, next) => { // this always has to combine with login middleware
    try {
        if (req.user.role < 10) { // 10 is editor
            return res.status(403).json({
                message: `Unauthorized role level: ${req.user.role}`
            })
        } else {
            next()
        }
    } catch (e) {
        res.status(403).json({
            message: "Unauthorized!",
            error: e
        })
        return null
    }
}