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
        const user = await userService.findUserByEmail(email.trim())

        if (user) {
            const token = sign({ userInfo: user });       

            mailService.client.sendEmail(mailService.mailTemplate({ toEmail: email.trim(), host: req.get('host'), token }), error => {
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