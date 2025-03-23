import formData from "form-data";
import Mailgun from "mailgun.js";
import { generateVerificationToken } from "./tokens";

// Add this new interface
interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Add this new function
export async function sendContactEmail({ name, email, subject, message }: ContactEmailData) {
  if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
    throw new Error("Missing Mailgun configuration");
  }

  // Initialize Mailgun
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY,
    url: "https://api.eu.mailgun.net",
  });

  try {
    await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `${name} <${email}>`,
      to: `support@confirmation.applyninja.ai`,
      subject: `[ApplyNinja Bug Report] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">New Bug Report from ApplyNinja</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #0070f3; background-color: #f5f5f5;">
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #666; font-size: 12px;">
            This message was sent from the ApplyNinja bug report form.
          </p>
        </div>
      `,
      "h:Reply-To": email,
    });
  } catch (error) {
    console.error("Contact email sending error:", error);
    throw error;
  }
}

export async function sendVerificationEmail(email: string) {
  if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
    throw new Error("Missing Mailgun configuration");
  }

  // Initialize Mailgun only when sending
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY,
    url: "https://api.eu.mailgun.net",
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
    url: "https://api.eu.mailgun.net",
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

export async function sendWelcomeEmail(email: string) {
  console.log("send welcome email");
  if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
    throw new Error("Missing Mailgun configuration");
  }

  // Initialize Mailgun
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY,
    url: "https://api.eu.mailgun.net",
  });

  const baseUrl =
    process.env.NODE_ENV === "production" ? "https://applyninja.ai" : "http://localhost:3000";

  const iconUrl = `${baseUrl}/icons/icon-applyninja.png`;

  try {
    await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `ApplyNinja.ai <noreply@${process.env.MAILGUN_DOMAIN}>`,
      to: email,
      subject: "Welcome to ApplyNinja.ai!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="display: inline-flex; align-items: center; justify-content: center;">
              <img src="${iconUrl}" alt="Shuriken Icon" style="width: 40px; height: auto; margin-right: 10px;" />
              <span style="font-family: 'Arial Black', Gadget, sans-serif; font-weight: bold; font-size: 24px; letter-spacing: 1px;">applyninja.ai</span>
            </div>
          </div>
          
          <h1 style="color: #333; text-align: center; margin-bottom: 30px;">Welcome to ApplyNinja.ai!</h1>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Thank you for joining ApplyNinja.ai! We're excited to have you on board and can't wait to help you optimize your job application process.
          </p>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            With ApplyNinja.ai, you'll be able to:
          </p>
          
          <ul style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px; padding-left: 20px;">
            <li>Create professional resumes tailored to specific job postings</li>
            <li>Generate compelling cover letters that highlight your unique qualifications</li>
            <li>Track your job applications in one convenient place</li>
            <li>Receive AI-powered insights to improve your application success rate</li>
          </ul>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            To get started, simply log in to your account and explore our features. If you have any questions or need assistance, our support team is here to help.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${baseUrl}/dashboard" 
               style="background-color: #0070f3; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Go to Dashboard
            </a>
          </div>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6; text-align: center;">
            We're thrilled to be part of your professional journey!
          </p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #888; font-size: 14px;">
            <p>ApplyNinja.ai Team</p>
            <p>
              <a href="${baseUrl}" style="color: #0070f3; text-decoration: none;">Visit our website</a> | 
              <a href="${baseUrl}/faq" style="color: #0070f3; text-decoration: none;">FAQ</a> | 
              <a href="${baseUrl}/contact" style="color: #0070f3; text-decoration: none;">Contact Us</a>
            </p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Welcome email sending error:", error);
    throw error;
  }
}
