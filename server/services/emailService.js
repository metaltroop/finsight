const nodemailer = require('nodemailer');
const { otpTemplate, welcomeTemplate } = require('./emailTemplates');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'iamproxisys@gmail.com',
    pass: process.env.APP_PASSWORD
  }
});

const sendEmail = async (to, template) => {
  try {
    const mailOptions = {
      from: '"Finsight Support" <iamproxisys@gmail.com>',
      to,
      subject: template.subject,
      html: template.html
    };
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

const sendOTP = async (email, otp) => {
  return sendEmail(email, otpTemplate(otp));
};

const sendWelcomeEmail = async (email, name) => {
  return sendEmail(email, welcomeTemplate(name));
};

module.exports = { sendOTP, sendWelcomeEmail };
