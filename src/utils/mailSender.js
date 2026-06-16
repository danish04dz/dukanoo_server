const nodemailer = require('nodemailer')
require("dotenv").config()

// create transporter
const transporter = nodemailer.createTransport({
    host : process.env.EMAIL_HOST,
    secure : true,
    
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS
    }, 
})

// send Mail function
const sendMail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail ({
            from : process.env.EMAIL_USER,
            to,
            subject,
            html,
        })
        console.log('Email sent: ' + info.response)
        return info

    }
    catch (error) {
        console.log(error)
        throw new Error('Error sending email')
    }
}

module.exports = {
    sendMail
}