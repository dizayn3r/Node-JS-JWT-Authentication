import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

var transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  service: "gmail",
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Admin Gmail ID
    pass: process.env.EMAIL_PASSWORD, // Admin Gmail Password
  },
});

function mailOptions(toEmail, subject, body) {
  return {
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: subject,
    text: body,
  };
}

export default transporter;
