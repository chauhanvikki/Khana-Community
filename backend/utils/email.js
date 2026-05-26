import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 60000,
    greetingTimeout: 60000,
    socketTimeout: 60000,
  });
};

export const sendOTP = async (email, otp) => {
  const transporter = createTransporter();
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
  const transporter = createTransporter();
  const mailOptions = {
    from: `"Khana Community" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🍱 Welcome to Khana Community! You are making a difference ❤️',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #FF9933, #FF6F00); padding: 40px 30px; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 10px;">🍱</div>
          <h1 style="color: white; margin: 0; font-size: 2rem;">Welcome to Khana Community!</h1>
          <p style="color: rgba(255,255,255,0.9); margin-top: 8px; font-size: 1rem;">Serving with Love ❤️</p>
        </div>
        <div style="padding: 30px; background: #fff;">
          <h2 style="color: #FF6F00;">Hello, ${name}! 👋</h2>
          <p style="color: #555; line-height: 1.7;">We are so excited to have you as part of our growing community. Your presence means the world to us and to the people we serve together.</p>
          
          <div style="background: #FFF8E7; border-left: 4px solid #FF9933; padding: 15px 20px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #FF6F00; font-weight: bold;">🌟 Your Impact Starts Now</p>
            <p style="margin: 8px 0 0; color: #555;">Every meal donated or delivered brings us closer to a hunger-free community.</p>
          </div>

          <h3 style="color: #333;">What you can do on Khana Community:</h3>
          <ul style="color: #555; line-height: 2;">
            <li>🍽️ <strong>Donate surplus food</strong> to those in need</li>
            <li>🚚 <strong>Volunteer</strong> to pick up and deliver food</li>
            <li>💬 <strong>Chat</strong> with donors and volunteers in real-time</li>
            <li>📊 <strong>Track</strong> your donations and impact</li>
          </ul>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://khana-community.vercel.app" style="background: linear-gradient(135deg, #FF9933, #FF6F00); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 1rem; display: inline-block;">Go to Dashboard →</a>
          </div>

          <p style="color: #555;">If you have any questions, feel free to reach out to us at <a href="mailto:singhvikki870@gmail.com" style="color: #FF9933;">singhvikki870@gmail.com</a></p>
        </div>
        <div style="background: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="color: #888; font-size: 0.85rem; margin: 0;">Made with ❤️ by <strong>Vishvendra Singh</strong> | Khana Community</p>
          <p style="color: #aaa; font-size: 0.75rem; margin: 5px 0 0;">© ${new Date().getFullYear()} Khana Community. All rights reserved.</p>
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};
export const sendContactEmail = async ({ name, email, subject, message }) => {
  const transporter = createTransporter();
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
