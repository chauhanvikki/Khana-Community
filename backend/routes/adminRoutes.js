import express from 'express';
import auth from '../Middlewares/authMiddleware.js';
import admin from '../Middlewares/adminMiddleware.js';
import UserModel from '../models/userModel.js';
import Donation from '../models/DonationModel.js';
import Message from '../models/Message.js';

const router = express.Router();

// Get Admin Dashboard Stats
router.get('/stats', auth, admin, async (req, res) => {
  try {
    const totalDonors = await UserModel.countDocuments({ role: 'donor' });
    const totalVolunteers = await UserModel.countDocuments({ role: 'volunteer' });
    const totalDonations = await Donation.countDocuments();
    const completedDonations = await Donation.countDocuments({ status: 'completed' });
    const inProgressDonations = await Donation.countDocuments({ status: { $in: ['claimed', 'delivered'] } });
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const donationStats = await Donation.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      summary: {
        totalDonors,
        totalVolunteers,
        totalDonations,
        completedDonations,
        inProgressDonations
      },
      donationStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin stats' });
  }
});

// Get All Donors
router.get('/donors', auth, admin, async (req, res) => {
  try {
    const donors = await UserModel.find({ role: 'donor' }).select('-password').lean();
    
    // Add counts manually for safety
    const donorsWithStats = await Promise.all(donors.map(async (d) => {
      const count = await Donation.countDocuments({ donorId: d._id });
      return { ...d, donationCount: count };
    }));

    res.json(donorsWithStats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donors' });
  }
});

// Get All Volunteers
router.get('/volunteers', auth, admin, async (req, res) => {
  try {
    const volunteers = await UserModel.find({ role: 'volunteer' }).select('-password').lean();
    
    const volunteersWithStats = await Promise.all(volunteers.map(async (v) => {
      const total = await Donation.countDocuments({ claimedBy: v._id });
      const completed = await Donation.countDocuments({ claimedBy: v._id, status: 'completed' });
      return { ...v, totalTasks: total, completedTasks: completed };
    }));

    res.json(volunteersWithStats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching volunteers' });
  }
});

// Get All Donations
router.get('/donations', auth, admin, async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donorId', 'name email phone')
      .populate('claimedBy', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donations' });
  }
});

export default router;
