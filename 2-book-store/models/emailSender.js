const nodemailer = require('nodemailer');
// const ejs = require('ejs');

const transporter = nodemailer.createTransport({
    host: "mail.coding-school.org",
    port: 465,
    auth: {
      user: "fbw8@coding-school.org",
      pass: "!234qweR"
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    }
  });
function sendEmail( email, message, callback) {
    const mailOption = {
        from: "fbw8@coding-school.org",
        to: email,
        subject: "Verify your Email",
        text:  message
    };
    transporter.sendMail(mailOption, (error, info) => {
        if(error){
            console.log(error);
            callback(false);
        } else {
            console.log(info);
            callback(true)
        }
    })

    
}
module.exports = {
    sendEmail
}