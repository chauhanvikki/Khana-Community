import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const SibApiV3Sdk = require('@getbrevo/brevo');

function getApi() {
  const api = new SibApiV3Sdk.TransactionalEmailsApi();
  api.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
  return api;
}

const FROM = { email: 'singhvikki870@gmail.com', name: 'Khana Community' };

export const sendOTP = async (email, otp) => {
  const result = await getApi().sendTransacEmail({
    sender: FROM,
    to: [{ email }],
    subject: 'Your Login OTP - Khana Community',
    htmlContent: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #eee;border-radius:10px;">
        <h2 style="color:#FF9933;text-align:center;">Khana Community</h2>
        <p>Hello,</p>
        <p>Your One-Time Password (OTP) for verification:</p>
        <div style="background:#FFF8E7;padding:20px;text-align:center;font-size:2rem;font-weight:bold;letter-spacing:5px;color:#FF6F00;border-radius:5px;margin:20px 0;">
          ${otp}
        </div>
        <p>This OTP is valid for 10 minutes.</p>
        <p style="font-size:0.8rem;color:#888;text-align:center;">Serving with Love ❤️</p>
      </div>
    `,
  });
  console.log('OTP email sent to', email, '| id:', result.body?.messageId);
  return result;
};

export const sendThankYou = async (email, name, role = 'donor') => {
  const isDonor = role === 'donor';
  const subject = isDonor
    ? '🍱 Welcome to Khana Community, Donor! Your generosity matters ❤️'
    : '🚚 Welcome to Khana Community, Volunteer! You are a real hero 💪';

  const gradientColors = isDonor ? '#FF9933, #FF6F00' : '#4CAF50, #2E7D32';
  const accentColor = isDonor ? '#FF6F00' : '#2E7D32';
  const accentColorLight = isDonor ? '#FF9933' : '#4CAF50';
  const highlightBg = isDonor ? '#FFF8E7' : '#E8F5E9';
  const heroIcon = isDonor ? '🍱' : '🚚';
  const heroTitle = isDonor ? 'Welcome, Generous Donor!' : 'Welcome, Amazing Volunteer!';
  const heroSubtitle = isDonor ? 'Your generosity feeds communities ❤️' : 'Your dedication delivers hope 💪';
  const introText = isDonor
    ? 'Thank you for joining as a <strong>Donor</strong>! Your willingness to share surplus food will directly help people in need.'
    : 'Thank you for joining as a <strong>Volunteer</strong>! Your time and energy are the backbone of our mission.';
  const highlightTitle = isDonor ? '🌟 Your Generosity Creates Impact' : '🦸 You Are a Food Hero';
  const highlightText = isDonor
    ? 'Every meal you donate feeds a hungry person and reduces food waste in your community.'
    : 'Every delivery you make brings a warm meal to someone who needs it.';
  const featureList = isDonor
    ? `<li>🍽️ <strong>List surplus food</strong> available for donation</li>
       <li>💬 <strong>Chat with volunteers</strong> to coordinate pickups</li>
       <li>📊 <strong>Track your donations</strong> and see your impact grow</li>`
    : `<li>📋 <strong>Browse available donations</strong> near your area</li>
       <li>🚗 <strong>Accept & deliver food</strong> to those in need</li>
       <li>🏆 <strong>Track your deliveries</strong> and see your impact grow</li>`;

  const result = await getApi().sendTransacEmail({
    sender: FROM,
    to: [{ email }],
    subject,
    htmlContent: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
        <div style="background:linear-gradient(135deg,${gradientColors});padding:40px 30px;text-align:center;">
          <div style="font-size:3rem;margin-bottom:10px;">${heroIcon}</div>
          <h1 style="color:white;margin:0;font-size:2rem;">${heroTitle}</h1>
          <p style="color:rgba(255,255,255,0.9);margin-top:8px;">${heroSubtitle}</p>
        </div>
        <div style="padding:30px;background:#fff;">
          <h2 style="color:${accentColor};">Hello, ${name}! 👋</h2>
          <p style="color:#555;line-height:1.7;">${introText}</p>
          <div style="background:${highlightBg};border-left:4px solid ${accentColorLight};padding:15px 20px;border-radius:6px;margin:20px 0;">
            <p style="margin:0;color:${accentColor};font-weight:bold;">${highlightTitle}</p>
            <p style="margin:8px 0 0;color:#555;">${highlightText}</p>
          </div>
          <ul style="color:#555;line-height:2;">${featureList}</ul>
          <div style="text-align:center;margin:30px 0;">
            <a href="https://khana-community.vercel.app" style="background:linear-gradient(135deg,${gradientColors});color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:1rem;display:inline-block;">${isDonor ? 'Start Donating →' : 'Start Volunteering →'}</a>
          </div>
          <p style="color:#555;">Questions? Reach us at <a href="mailto:singhvikki870@gmail.com" style="color:${accentColorLight};">singhvikki870@gmail.com</a></p>
        </div>
        <div style="background:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee;">
          <p style="color:#888;font-size:0.85rem;margin:0;">Made with ❤️ by <strong>Vishvendra Singh</strong> | Khana Community</p>
          <p style="color:#aaa;font-size:0.75rem;margin:5px 0 0;">© ${new Date().getFullYear()} Khana Community. All rights reserved.</p>
        </div>
      </div>
    `,
  });
  console.log(`Welcome email (${role}) sent to`, email, '| id:', result.body?.messageId);
  return result;
};

export const sendContactEmail = async ({ name, email, subject, message }) => {
  const result = await getApi().sendTransacEmail({
    sender: FROM,
    to: [{ email: 'singhvikki870@gmail.com' }],
    subject: `Contact Form: ${subject}`,
    htmlContent: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #ddd;border-radius:10px;overflow:hidden;">
        <div style="background:#FF9933;color:white;padding:20px;text-align:center;">
          <h2 style="margin:0;">New Inquiry</h2>
        </div>
        <div style="padding:20px;color:#333;">
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border:0;border-top:1px solid #eee;margin:20px 0;">
          <p><strong>Message:</strong></p>
          <div style="background:#fdfdfd;padding:15px;border-radius:5px;border:1px solid #eee;line-height:1.6;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
      </div>
    `,
  });
  console.log('Contact email sent | id:', result.body?.messageId);
  return result;
};
