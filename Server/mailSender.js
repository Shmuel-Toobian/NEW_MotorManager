const nodemailer = require('nodemailer');


exports.mailSender = (to, subject, message) => {


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'elirangiladi250@gmail.com',
            pass: process.env.APP_PASS
        }
    });

    const mailOptions = {
        from: 'elirangiladi250@gmail.com',
        to: to,
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}