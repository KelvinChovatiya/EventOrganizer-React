const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.SMTP_EMAIL, 
      pass: process.env.SMTP_PASSWORD, 
    },
  });

  // 2. Build the email package
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email, 
    subject: options.subject, 
    text: options.message, 
  };

  // 3. Send it
  const info = await transporter.sendMail(message);
  console.log('Message sent securely via Gmail: %s', info.messageId);
};

module.exports = sendEmail;
