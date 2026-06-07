import nodemailer from 'nodemailer';

// Lazy-init transporter: created on first use so dotenv has loaded by then
let transporter;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    transporter.verify((error, success) => {
      if (error) {
        console.error("SMTP Verify Error:", error);
      } else {
        console.log("SMTP Server Ready");
      }
    });
    console.log('Email transporter created for:', process.env.EMAIL_USER);
  }
  return transporter;
}

function getFromEmail() {
  return `Khana Community <${process.env.EMAIL_USER}>`;
}

export const sendOTP = async (email, otp) => {
  try {
    const info = await getTransporter().sendMail({
      from: getFromEmail(),
      to: email,
      subject: 'Your Login OTP - Khana Community',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #FF9933; text-align: center;">Khana Community</h2>
          <p>Hello,</p>
          <p>Your One-Time Password (OTP) for verification:</p>
          <div style="background: #FFF8E7; padding: 20px; text-align: center; font-size: 2rem; font-weight: bold; letter-spacing: 5px; color: #FF6F00; border-radius: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This OTP is valid for 10 minutes.</p>
          <p style="font-size: 0.8rem; color: #888; text-align: center;">Serving with Love ❤️</p>
        </div>
      `,
    });
    console.log('OTP email sent successfully to', email, ':', info.messageId);
    return info;
  } catch (err) {
    console.error('Failed to send OTP email to', email, ':', err.message);
    throw err;
  }
};

export const sendThankYou = async (email, name, role = 'donor') => {
  const isDonor = role === 'donor';

  const subject = isDonor
    ? '🍱 Welcome to Khana Community, Donor! Your generosity matters ❤️'
    : '🚚 Welcome to Khana Community, Volunteer! You are a real hero 💪';

  const heroIcon = isDonor ? '🍱' : '🚚';
  const heroTitle = isDonor
    ? 'Welcome, Generous Donor!'
    : 'Welcome, Amazing Volunteer!';
  const heroSubtitle = isDonor
    ? 'Your generosity feeds communities ❤️'
    : 'Your dedication delivers hope 💪';

  const gradientColors = isDonor
    ? '#FF9933, #FF6F00'
    : '#4CAF50, #2E7D32';
  const accentColor = isDonor ? '#FF6F00' : '#2E7D32';
  const accentColorLight = isDonor ? '#FF9933' : '#4CAF50';
  const highlightBg = isDonor ? '#FFF8E7' : '#E8F5E9';

  const introText = isDonor
    ? 'Thank you for joining as a <strong>Donor</strong>! Your willingness to share surplus food will directly help people in need. Together, we can make sure no meal goes to waste.'
    : 'Thank you for joining as a <strong>Volunteer</strong>! Your time and energy are the backbone of our mission. You are the bridge between donors and those who need food the most.';

  const highlightTitle = isDonor
    ? '🌟 Your Generosity Creates Impact'
    : '🦸 You Are a Food Hero';
  const highlightText = isDonor
    ? 'Every meal you donate feeds a hungry person and reduces food waste in your community.'
    : 'Every delivery you make brings a warm meal to someone who needs it. You are making a real difference.';

  const featureList = isDonor
    ? `<li>🍽️ <strong>List surplus food</strong> available for donation</li>
       <li>📸 <strong>Add photos</strong> so volunteers know what to pick up</li>
       <li>💬 <strong>Chat with volunteers</strong> to coordinate pickups</li>
       <li>📊 <strong>Track your donations</strong> and see your impact grow</li>`
    : `<li>📋 <strong>Browse available donations</strong> near your area</li>
       <li>🚗 <strong>Accept & deliver food</strong> to those in need</li>
       <li>💬 <strong>Chat with donors</strong> to coordinate pickups</li>
       <li>🏆 <strong>Track your deliveries</strong> and see your impact grow</li>`;

  const featureHeading = isDonor
    ? 'What you can do as a Donor:'
    : 'What you can do as a Volunteer:';

  const ctaText = isDonor ? 'Start Donating →' : 'Start Volunteering →';

  try {
    const info = await getTransporter().sendMail({
      from: getFromEmail(),
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, ${gradientColors}); padding: 40px 30px; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 10px;">${heroIcon}</div>
            <h1 style="color: white; margin: 0; font-size: 2rem;">${heroTitle}</h1>
            <p style="color: rgba(255,255,255,0.9); margin-top: 8px;">${heroSubtitle}</p>
          </div>
          <div style="padding: 30px; background: #fff;">
            <h2 style="color: ${accentColor};">Hello, ${name}! 👋</h2>
            <p style="color: #555; line-height: 1.7;">${introText}</p>
            
            <div style="background: ${highlightBg}; border-left: 4px solid ${accentColorLight}; padding: 15px 20px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; color: ${accentColor}; font-weight: bold;">${highlightTitle}</p>
              <p style="margin: 8px 0 0; color: #555;">${highlightText}</p>
            </div>

            <h3 style="color: #333;">${featureHeading}</h3>
            <ul style="color: #555; line-height: 2;">
              ${featureList}
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://khana-community.vercel.app" style="background: linear-gradient(135deg, ${gradientColors}); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 1rem; display: inline-block;">${ctaText}</a>
            </div>

            <p style="color: #555;">Questions? Reach us at <a href="mailto:singhvikki870@gmail.com" style="color: ${accentColorLight};">singhvikki870@gmail.com</a></p>
          </div>
          <div style="background: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 0.85rem; margin: 0;">Made with ❤️ by <strong>Vishvendra Singh</strong> | Khana Community</p>
            <p style="color: #aaa; font-size: 0.75rem; margin: 5px 0 0;">© ${new Date().getFullYear()} Khana Community. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    console.log(`Welcome email (${role}) sent successfully to`, email, ':', info.messageId);
    return info;
  } catch (err) {
    console.error('Failed to send welcome email to', email, ':', err.message);
    throw err;
  }
};

export const sendContactEmail = async ({ name, email, subject, message }) => {
  try {
    const info = await getTransporter().sendMail({
      from: getFromEmail(),
      to: 'singhvikki870@gmail.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
          <div style="background: #FF9933; color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">New Inquiry</h2>
          </div>
          <div style="padding: 20px; color: #333;">
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p><strong>Message:</strong></p>
            <div style="background: #fdfdfd; padding: 15px; border-radius: 5px; border: 1px solid #eee; line-height: 1.6;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>
      `,
    });
    console.log('Contact email sent successfully:', info.messageId);
    return info;
  } catch (err) {
    console.error('Failed to send contact email:', err.message);
    throw err;
  }
};
