import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Login OTP - Khana Community',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #FF9933; text-align: center;">Khana Community</h2>
        <p>Hello,</p>
        <p>You requested a login via Google. Please use the following One-Time Password (OTP) to complete your verification:</p>
        <div style="background: #FFF8E7; padding: 20px; text-align: center; font-size: 2rem; font-weight: bold; letter-spacing: 5px; color: #FF6F00; border-radius: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 0.8rem; color: #888; text-align: center;">Serving with Love ❤️</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendThankYou = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to Khana Community! ❤️',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #4CAF50; text-align: center;">Thank You, ${name}!</h2>
        <p>We are thrilled to have you as part of our mission to fight hunger.</p>
        <p>By joining Khana Community, you are helping us connect surplus food with those who need it most. Your participation makes a real difference in the world.</p>
        <div style="text-align: center; margin: 30px 0;">
          <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600&auto=format&fit=crop" alt="Helping Hands" style="max-width: 100%; border-radius: 10px;">
        </div>
        <p>Whether you are a donor or a volunteer, your support is invaluable.</p>
        <p>If you have any questions, feel free to reply to this email or reach out to our support team.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 0.8rem; color: #888; text-align: center;">Khana Community — Serving with Love ❤️</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
export const sendContactEmail = async ({ name, email, subject, message }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Admin receives the message
    subject: `Contact Form: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
        <div style="background: #FF9933; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">New Inquiry</h2>
        </div>
        <div style="padding: 20px; color: #333;">
          <p><strong>From:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p><strong>Message:</strong></p>
          <div style="background: #fdfdfd; padding: 15px; border-radius: 5px; border: 1px solid #eee; line-height: 1.6;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
        <div style="background: #f9f9f9; color: #888; padding: 10px; text-align: center; font-size: 11px;">
          Received via Khana Community Contact Form
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
