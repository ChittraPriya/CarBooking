const nodemailer = require('nodemailer')
const { EMAIL_USER, GOOGLE_KEY_PASSWORD } = require('./config.js')

//create reusable transporter object using the defalut smtp transport 
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: EMAIL_USER,
        pass: GOOGLE_KEY_PASSWORD
    }
})

const sendEmail = async( to, subject, text) => {
    const mailOptions = {
        from: EMAIL_USER,
        to: to,
        subject: subject,
        text: text,
        html
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email Sent:' + info.response)
} 

module.exports = sendEmail