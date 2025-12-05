import Mailjet from "node-mailjet";
import dotenv from "dotenv";
import { emailTokenTemplate } from "../templates/emailTokenTemplate.js";
import { passwordTokenTemplate } from "../templates/passwordTokenTemplate.js";
dotenv.config({
  quiet: true,
});

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
)

export const sendEmail = async (to, template, token) => {
  try {
    if (template == "email") {
      const userFrom = "emailVerification";
      const subject = "Confirm Your Account | CollabSphere";
      const url = `${process.env.CLIENT_URL}/auth?token=${token}&from=${userFrom}`;
      const html = emailTokenTemplate(url);
      const sendMail = await mailjet
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: process.env.MAILJET_FROM_EMAIL,
                Name: process.env.MAILJET_FROM_NAME,
              },
              To: [
                {
                  Email: to,
                },
              ],
              Subject: subject,
              HTMLPart: html,
            },
          ],
        }); 
      return sendMail;
    } else if (template == "password") {
      const userFrom = "userVerification";
      const url = `${process.env.CLIENT_URL}/auth?token=${token}&from=${userFrom}`;
      const html = passwordTokenTemplate(url);
      const subject = "Your Password Reset Link | CollabSphere";
      const sendMail = await mailjet
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: process.env.MAILJET_FROM_EMAIL,
                Name: process.env.MAILJET_FROM_NAME,
              },
              To: [
                {
                  Email: to,
                },
              ],
              Subject: subject,
              HTMLPart: html,
            },
          ],
        });
      return sendMail;
    } else {
      throw new Error("Invalid email template.");
    }
  } catch (err) {
    throw new Error("Sending email failed.");
  }
};