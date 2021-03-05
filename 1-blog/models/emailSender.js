const nodemailer = require('nodemailer');
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
function sendEmail(name, email, subject, message, callback) {
    const mailOption = {
        from: "fbw8@coding-school.org",
        to: "ahmad.osman@digitalcareerinstitute.org",
        subject: "email from your website",
        text: subject + '\n' + name + '\n' + email + '\n' + message
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