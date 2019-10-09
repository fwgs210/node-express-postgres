const userService = require('../services/user.service')
const mailService = require('../services/mail.service')
const { sign } = require('../utils/tokenService')

module.exports.reset = async(req, res) => {
    let { email } = req.body;

    email = email.trim().replace(/\s+/g, '')

    if(!email) {
        res.status(500).json({
            message: 'email invalid.'
        })
    }

    try {
        const user = await userService.findUserByEmail(email)

        if (user) {
            
            const {
                _id,
                username,
                email
            } = user

            const token = sign({ 
                id: _id,
                username,
                email
             });       
            const resetURL = `http://${req.headers.host}/reset-password/${token}`

            mailService.client.sendEmail(mailService.mailTemplate({ toEmail: email, resetURL }), error => {
                if (error) {
                    res.status(203).json({ message: 'There was an error sending the email' })
                } else {
                    res.status(200).json({ message: 'Your password reset link is sent to your email.' })
                }
            })

            /* Gmail way below */

            // transport.sendMail(mailTemplate({ toEmail: email, token }))

            // transport.verify(error => {
            //     if (error) {
            //         res.status(203).json({ message: 'There was an error sending the email' })
            //     } else {
            //         res.status(200).json({ message: 'Your password reset link is sent to your email.' })
            //     }
            // });
        } else {
            res.status(203).json({ message: 'Your email does not exist in our database.' })
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports.updateUserPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const { _id } = req.token
        const hashPass = await bcrypt.hash(newPassword, 10)
    
        const updatedUser = await userService.findUserByIdAndUpdatePassword(_id, hashPass)
        const newToken = await sign(updatedUser)
        res.status(200).json({ message: 'Password updated.', token: newToken })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}