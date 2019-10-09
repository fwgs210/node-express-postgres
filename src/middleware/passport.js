const passport    = require('passport');
const passportJWT = require("passport-jwt");
const { key } = require('../config/serverSetup')
const userService = require('../services/user.service')

const ExtractJWT = passportJWT.ExtractJwt;

// const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;

// passport.use(new LocalStrategy({
//         usernameField: 'email',
//         passwordField: 'password'
//     },
//     function (email, password, cb) {

//         //Assume there is a DB module pproviding a global UserModel
//         return UserModel.findOne({email, password})
//             .then(user => {
//                 if (!user) {
//                     return cb(null, false, {message: 'Incorrect email or password.'});
//                 }

//                 return cb(null, user, {
//                     message: 'Logged In Successfully'
//                 });
//             })
//             .catch(err => {
//                 return cb(err);
//             });
//     }
// ));

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: key
    },
    async (jwtPayload, next) => {
        //find the user in db if needed
        try {
            const user = await userService.findUserById(jwtPayload.id)
            return next(null, user);
        } catch(err) {
            return next(err);
        }
    }
));