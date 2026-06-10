const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';
const FROM = { email: 'singhvikki870@gmail.com', name: 'Khana Community' };

async function sendEmail(to, subject, htmlContent) {
  const res = await fetch(BREVO_URL, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ sender: FROM, to: [{ email: to }], subject, htmlContent }),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error('Brevo error:', data);
    throw Object.assign(new Error(data.message || 'Brevo API error'), { code: data.code });
  }
  console.log('Email sent to', to, '| id:', data.messageId);
  return data;
}

export const sendOTP = async (email, otp) => {
  return sendEmail(email, 'Your Login OTP - Khana Community', `
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
  `);
};

export const sendThankYou = async (email, name, role = 'donor') => {
  const isDonor = role === 'donor';
  const subject = isDonor
    ? 'Welcome to Khana Community, Donor! Your generosity matters'
    : 'Welcome to Khana Community, Volunteer! You are a real hero';

  const BASE_URL = 'https://khana-community.vercel.app';
  const heroImage = isDonor
    ? `${BASE_URL}/email-donor-hero.png`
    : `${BASE_URL}/email-volunteer-hero.png`;

  const gradientColors = isDonor ? '#FF9933, #FF6F00' : '#4CAF50, #2E7D32';
  const accentColor = isDonor ? '#FF6F00' : '#2E7D32';
  const accentColorLight = isDonor ? '#FF9933' : '#4CAF50';
  const highlightBg = isDonor ? '#FFF8E7' : '#E8F5E9';
  const heroTitle = isDonor ? 'Welcome, Generous Donor!' : 'Welcome, Amazing Volunteer!';
  const heroSubtitle = isDonor
    ? 'Your generosity feeds communities & changes lives'
    : 'Your dedication delivers hope & transforms communities';
  const introText = isDonor
    ? 'Thank you for joining as a <strong>Donor</strong>! Your willingness to share surplus food will directly help people in need.'
    : 'Thank you for joining as a <strong>Volunteer</strong>! Your time and energy are the backbone of our mission.';
  const highlightTitle = isDonor ? 'Your Generosity Creates Impact' : 'You Are a Food Hero';
  const highlightText = isDonor
    ? 'Every meal you donate feeds a hungry person and reduces food waste in your community.'
    : 'Every delivery you make brings a warm meal to someone who needs it.';
  const featureList = isDonor
    ? `<li style="padding:4px 0;"><strong>List surplus food</strong> available for donation</li>
       <li style="padding:4px 0;"><strong>Chat with volunteers</strong> to coordinate pickups</li>
       <li style="padding:4px 0;"><strong>Track your donations</strong> and see your impact grow</li>`
    : `<li style="padding:4px 0;"><strong>Browse available donations</strong> near your area</li>
       <li style="padding:4px 0;"><strong>Accept & deliver food</strong> to those in need</li>
       <li style="padding:4px 0;"><strong>Track your deliveries</strong> and see your impact grow</li>`;

  return sendEmail(email, subject, `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.12);border:1px solid #e0e0e0;">
      <!-- Hero Image Section -->
      <div style="position:relative;overflow:hidden;">
        <img src="${heroImage}" alt="${isDonor ? 'Happy people receiving food donations' : 'Volunteer delivering food to community'}" style="width:100%;height:280px;object-fit:cover;display:block;" />
        <div style="background:linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 100%);position:absolute;bottom:0;left:0;right:0;padding:30px 25px 20px;">
          <h1 style="color:white;margin:0;font-size:1.6rem;text-shadow:0 2px 4px rgba(0,0,0,0.3);">${heroTitle}</h1>
          <p style="color:rgba(255,255,255,0.9);margin:6px 0 0;font-size:0.95rem;text-shadow:0 1px 3px rgba(0,0,0,0.3);">${heroSubtitle}</p>
        </div>
      </div>

      <!-- Content Section -->
      <div style="padding:28px 30px;background:#ffffff;">
        <h2 style="color:${accentColor};margin:0 0 12px;font-size:1.3rem;">Hello, ${name}!</h2>
        <p style="color:#444;line-height:1.7;margin:0 0 18px;font-size:0.95rem;">${introText}</p>

        <!-- Highlight Box -->
        <div style="background:${highlightBg};border-left:4px solid ${accentColorLight};padding:16px 20px;border-radius:0 8px 8px 0;margin:0 0 22px;">
          <p style="margin:0;color:${accentColor};font-weight:bold;font-size:1rem;">${highlightTitle}</p>
          <p style="margin:8px 0 0;color:#555;font-size:0.9rem;line-height:1.6;">${highlightText}</p>
        </div>

        <!-- What You Can Do -->
        <p style="color:${accentColor};font-weight:bold;font-size:0.95rem;margin:0 0 8px;">What you can do:</p>
        <ul style="color:#555;line-height:1.8;padding-left:18px;margin:0 0 24px;font-size:0.9rem;">${featureList}</ul>

        <!-- CTA Button -->
        <div style="text-align:center;margin:28px 0 10px;">
          <a href="${BASE_URL}" style="background:linear-gradient(135deg,${gradientColors});color:white;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:1rem;display:inline-block;box-shadow:0 3px 10px rgba(0,0,0,0.15);">${isDonor ? 'Start Donating' : 'Start Volunteering'}</a>
        </div>

        <p style="color:#777;font-size:0.85rem;margin:18px 0 0;text-align:center;">Questions? Reach us at <a href="mailto:singhvikki870@gmail.com" style="color:${accentColorLight};text-decoration:none;font-weight:500;">singhvikki870@gmail.com</a></p>
      </div>

      <!-- Footer -->
      <div style="background:linear-gradient(135deg,#f8f8f8,#f0f0f0);padding:18px 20px;text-align:center;border-top:1px solid #e8e8e8;">
        <p style="color:#888;font-size:0.8rem;margin:0;">Made with ❤️ by <strong>Vishvendra Singh</strong> | Khana Community</p>
        <p style="color:#aaa;font-size:0.7rem;margin:4px 0 0;">© ${new Date().getFullYear()} Khana Community. All rights reserved.</p>
      </div>
    </div>
  `);
};

export const sendContactEmail = async ({ name, email, subject, message }) => {
  return sendEmail('singhvikki870@gmail.com', `Contact Form: ${subject}`, `
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
  `);
};
