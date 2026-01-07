import nodemailer from "nodemailer";
import { EMAIL_PASSWORD } from "./env.js";

export const accountEmail = "vishalpiro4518@gmail.com";
const transporter = nodemailer.transport({
  service: "gmail",
  auth: {
    user: accountEmail,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default transporter;
