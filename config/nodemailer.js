import nodemailer from "nodemailer";

export const accountEmail = "vishalpiro4518@gmail.com";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: accountEmail,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default transporter;
