import { Resend } from "resend";
import dotenv from "dotenv";
import { emailTokenTemplate } from "../templates/emailTokenTemplate.js";
import { passwordTokenTemplate } from "../templates/passwordTokenTemplate.js";
dotenv.config();

const resend = new Resend(process.env.RESEND_KEY);
const sendFrom = "CollabSphere <onboarding@resend.dev>";

export const sendEmail = async (to, template, token) => {
  try {
    if (template == "email") {
      const userFrom = "emailVerification";
      const subject = "Confirm Your Account | CollabSphere";
      const url = `${process.env.CLIENT_URL}/auth?token=${token}&from=${userFrom}`;
      const html = emailTokenTemplate(url);
      const sendMail = await resend.emails.send({
        from: sendFrom,
        to,
        subject,
        html,
      });
      return sendMail;
    } else if (template == "password") {
      const userFrom = "userVerification";
      const url = `${process.env.CLIENT_URL}/auth?token=${token}&from=${userFrom}`;
      const html = passwordTokenTemplate(url);
      const subject = "Your Password Reset Link | CollabSphere";
      const sendMail = await resend.emails.send({
        from: sendFrom,
        to,
        subject,
        html,
      });
      return sendMail;
    } else {
        throw new Error("Invalid email template.");
    }
  } catch (err) {
    throw new Error("Sending email failed.");
  }
};