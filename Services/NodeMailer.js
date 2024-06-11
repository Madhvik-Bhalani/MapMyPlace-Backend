const nodemailer = require('nodemailer');
const MailTemplets = require('./MailTemplates.js');
const { log } = require('console');

function nodeMailer(type, userEmail, header, userName, body) {
    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAILER_EMAIL, // app's email name
            pass: process.env.MAILER_EMAIL_PASS, // app's email password
            },
            });
            
            
            
            switch (type) {
                case 'resetPassword':
            var mailOptions = MailTemplets.resetPasswordMail(userEmail, userName, body);
            break;
    }



    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })


};


module.exports = nodeMailer;