const passport    = require('passport');
const passportJWT = require("passport-jwt");
const { key } = require('../config/serverSetup')
const userService = require('../services/user.service')

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;
const { sign, signRefreshToken } = require('../utils/tokenService')

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    async (username, password, next) => {
        //Assume there is a DB module pproviding a global UserModel
        try {
            const user = await userService.login(username, password);
            if (!user) {
                return next(null, false, { message: 'Incorrect email or password.' });
            }
            const token = sign({ 
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.access_level.permission_level
            });
            
            const refreshToken =  signRefreshToken({ 
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.access_level.permission_level
            });

            const tokens = {
                token,
                refreshToken
            }
            return next(null, tokens, {
                message: 'Logged In Successfully'
            });
        }
        catch (err) {
            return next(err);
        }
    }
));

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: key
    },
    async (jwtPayload, next) => {
        //find the user in db if needed
        try {
            const user = await userService.findUserById(jwtPayload.id)
            user.role = user.access_level.permission_level
            return next(null, user);
        } catch(err) {
            return next(err);
        }
    }
));