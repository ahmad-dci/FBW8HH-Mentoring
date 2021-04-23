const nodemailer = require('nodemailer');
const ejs = require('ejs');

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
    ejs.renderFile(__dirname + '/email-template.ejs',{subject, name, email, message }, (err, text) => {
        const mailOption = {
            from: "fbw8@coding-school.org",
            to: "ahmad.osman@digitalcareerinstitute.org",
            subject: "email from your website",
            html:  text
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
    })

    
}
module.exports = {
    sendEmail
}