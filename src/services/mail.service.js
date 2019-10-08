
const postmark = require("postmark");
const EMAIL_API = require('../config/emailToken')
const client = new postmark.Client(EMAIL_API.POSTMARK_API_KEY);

const mailTemplate = ({ toEmail, resetURL }) => ({
    "From": EMAIL_API.POSTMARK_FROM_EMAIL,
    "To": toEmail,
    "Subject": "Password Reset",
    "HtmlBody": `
        <div style="
            border: 1px solid black;
            padding: 20px;
            font-family: sans-serif;
            line-height: 2;
            font-size: 20px;
        ">
            <h3>Below is your password reset link:</h3>
            <a href="${resetURL}">Reset your password now</a><br/>
            <p>- Tracy Su</p>
        </div>`,
})

module.exports = {
    mailTemplate,
    client
};

// nodemailer code below

// const nodemailer = require('nodemailer');
// const transport = nodemailer.createTransport({
//     service: token.EMAIL_HOST,
//     auth: {
//         type: token.EMAIL_CONNECTION_TYPE,
//         user: token.EMAIL_USERNAME,
//         clientId: token.EMAIL_CLIENTID,
//         clientSecret: token.EMAIL_CLIENTSECRET,
//         refreshToken: token.EMAIL_REFRESHTOKEN,
//         accessToken: token.EMAIL_ACCESSTOKEN
//     }
// });

// const mailTemplate = ({ toEmail, token }) => ({
//     from: '"Password Reset" <donotreply@fullstackapp.com>',
//     to: toEmail,
//     subject: "Password Reset",
//     generateTextFromHTML: true,
//     html: `<h1>Below is your password reset link:</h1>
//            <p><a href="https://tracysu.herokuapp.com/reset-password/${token}">Reset your password now</a></p>
//            <p>&nbsp;</p>
//            <p> - Tracy Su</p>
//         ` 
// })

// module.exports.mailTemplate = mailTemplate;
// module.exports.transport = transport;