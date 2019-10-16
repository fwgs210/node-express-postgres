const { verify, sign, signRefreshToken } = require('../utils/tokenService');
const userService = require('../services/user.service')

module.exports.login = async (req, res, next) => {
    try {
        if(req.headers['authorization']) { // token re-login
            const bearerToken = req.headers['authorization'].split(' ')[1]
            const decoded = await verify(bearerToken)
            req.token = bearerToken
            req.user = {
                _id: decoded._id,
                username: decoded.username,
                email: decoded.email,
                role: decoded.role
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
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        });
        
        const refreshToken = await signRefreshToken({ 
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        });

        req.token = token
        req.refreshToken = refreshToken
        req.user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
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
        if (req.user.role !== 'administrator') {
            return res.status(403).json({
                message: `Unauthorized role: ${req.user.role}`
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