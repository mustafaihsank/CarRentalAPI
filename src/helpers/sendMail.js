"use strict";
/* -------------------------------------------------------
    MAIL
------------------------------------------------------- */
// sendMail(to, subject, message):

const nodemailer = require("nodemailer");

module.exports = function (to, subject, message) {
  // Create Test (Fake) Email Account:
  // nodemailer.createTestAccount().then((email) => console.log(email))
  /*
    {
      user: 'dt2luxwyjdzufq7a@ethereal.email',
      pass: 'RyTdGXyWEbVVuaNFSY',
      smtp: { host: 'smtp.ethereal.email', port: 587, secure: false },
      imap: { host: 'imap.ethereal.email', port: 993, secure: true },
      pop3: { host: 'pop3.ethereal.email', port: 995, secure: true },
      web: 'https://ethereal.email'
    }
    */
  /*
    // Connect to mail-server:
    const transporter = nodemailer.createTransport({
         // SMTP
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true, tls, ssl
        auth: {
            user: 'dt2luxwyjdzufq7a@ethereal.email',
            pass: 'RyTdGXyWEbVVuaNFSY'
        }
    })
    // console.log(transporter)
    
    // SendMail:
    transporter.sendMail({
        from: 'dt2luxwyjdzufq7a@ethereal.email',
        to: 'mustafaihsankabakcili@gmail.com', // 'a@b.com, b@c.com'
        subject: 'Hello',
        // Message:
        text: 'Hello There. How are you?',
        html: '<b>Hello There.</b> <p>How are you?</p>',
    }, (error, success) => { 
        error ? console.log('error:', error) : console.log('success:', success)
     })
    */

  //? GoogleMail (gmail):
  //* Google -> AccountHome -> Security -> Two-Step-Verify -> App-Passwords
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mustafaihsankabakcili@gmail.com",
      pass: "SAMPLE SAMPLE SAMPLE SAMPLE",
    },
  });

  // //? YandexMail (yandex):
  // const transporter = nodemailer.createTransport({
  //     service: 'Yandex',
  //     auth: {
  //         user: 'username@yandex.com',
  //         pass: 'password' // your emailPassword
  //     }
  // })

  transporter.sendMail(
    {
      // from: 'mustafaihsankabakcili@gmail.com',
      to: to, // 'mustafaihsankabakcili@gmail.com',
      subject: subject, // 'Hello',
      text: message, // 'Hello There. How are you?',
      html: message, // '<b>Hello There.</b> <p>How are you?</p>',
    },
    (error, success) => {
      error ? console.log("error:", error) : console.log("success:", success);
    }
  );
};
