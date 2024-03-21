const {email,password} = require('./details')
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: email,
        pass: password,
    }
})

const mail = {
    from: email,
    to: 'pteja3031@gmail.com',
    subject: 'Vachesa',
    text: 'ipudu chepandra abbailu what to do what not to do' 
};
transporter.sendMail(mail, (error, info) => {
    if (error) {
      console.error(error.message);
    } else {
      console.log('Email sent: ' + info.response);
    }
});






