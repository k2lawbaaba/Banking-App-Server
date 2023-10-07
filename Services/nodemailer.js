const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "abbymikey2@gmail.com",
    pass: process.env.APP_PASSWORD,
  },
});

const nodeMailer = (userEmail, subject, message) => {
  const mailOptions = {
    from: "abbymikey2@gmail.com", // Sender address
    to: userEmail, // List of recipients
    subject: subject, // Subject line
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
module.exports = nodeMailer;
