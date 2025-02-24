import formData from "form-data";
import Mailgun from "mailgun.js";
import { generateVerificationToken } from "./tokens";

export async function sendVerificationEmail(email: string) {
  if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
    throw new Error("Missing Mailgun configuration");
  }

  // Initialize Mailgun only when sending
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY,
    url: "https://api.mailgun.net",
  });

  const token = await generateVerificationToken(email);
  const baseUrl =
    process.env.NODE_ENV === "production" ? "https://applyninja.ai" : "http://localhost:3000";

  const verificationUrl = `${baseUrl}/verify?token=${token}`;

  try {
    await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `ApplyNinja.ai <noreply@${process.env.MAILGUN_DOMAIN}>`,
      to: email,
      subject: "Verify your email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">Welcome to ApplyNinja.ai!</h2>
          <p style="color: #666; text-align: center;">Please verify your email address to complete your registration.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #0070f3; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #666; text-align: center; font-size: 14px;">
            If you didn't create an account, you can safely ignore this email.
          </p>
          <p style="color: #666; text-align: center; font-size: 12px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${verificationUrl}" style="color: #0070f3;">${verificationUrl}</a>
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string) {
  if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
    throw new Error("Missing Mailgun configuration");
  }

  // Initialize Mailgun
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY,
    url: "https://api.mailgun.net",
  });

  const token = await generateVerificationToken(email);
  const baseUrl =
    process.env.NODE_ENV === "production" ? "https://applyninja.ai" : "http://localhost:3000";

  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  try {
    await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `ApplyNinja.ai <noreply@${process.env.MAILGUN_DOMAIN}>`,
      to: email,
      subject: "Reset your password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
          <p style="color: #666; text-align: center;">Click the button below to reset your password.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #0070f3; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; text-align: center; font-size: 14px;">
            If you didn't request this password reset, you can safely ignore this email.
          </p>
          <p style="color: #666; text-align: center; font-size: 12px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #0070f3;">${resetUrl}</a>
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
}
