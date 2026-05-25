import express from 'express';
import { sendContactEmail } from '../utils/email.js';

const router = express.Router();

// Contact form submission
router.post('/send', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Use centralized email utility
    await sendContactEmail({ name, email, subject, message });

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

export default router;