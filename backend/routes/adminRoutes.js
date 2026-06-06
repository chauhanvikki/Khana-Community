import express from 'express';
import auth from '../Middlewares/authMiddleware.js';
import admin from '../Middlewares/adminMiddleware.js';
import UserModel from '../models/userModel.js';
import Donation from '../models/DonationModel.js';
import Message from '../models/Message.js';
import redis from '../utils/redis.js';

const router = express.Router();

// Get Admin Dashboard Stats
router.get('/stats', auth, admin, async (req, res) => {
  try {
    const cacheKey = 'admin:stats';

    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log('[Cache] HIT admin:stats');
        return res.json(JSON.parse(cached));
      }
    }

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

    const result = {
      summary: {
        totalDonors,
        totalVolunteers,
        totalDonations,
        completedDonations,
        inProgressDonations
      },
      donationStats
    };

    if (redis) await redis.setex(cacheKey, 60, JSON.stringify(result));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin stats' });
  }
});

// Get All Donors
router.get('/donors', auth, admin, async (req, res) => {
  try {
    const cacheKey = 'admin:donors';

    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log('[Cache] HIT admin:donors');
        return res.json(JSON.parse(cached));
      }
    }

    const donors = await UserModel.find({ role: 'donor' }).select('-password').lean();
    
    const donorsWithStats = await Promise.all(donors.map(async (d) => {
      const count = await Donation.countDocuments({ donorId: d._id });
      return { ...d, donationCount: count };
    }));

    if (redis) await redis.setex(cacheKey, 60, JSON.stringify(donorsWithStats));

    res.json(donorsWithStats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donors' });
  }
});

// Get All Volunteers
router.get('/volunteers', auth, admin, async (req, res) => {
  try {
    const cacheKey = 'admin:volunteers';

    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log('[Cache] HIT admin:volunteers');
        return res.json(JSON.parse(cached));
      }
    }

    const volunteers = await UserModel.find({ role: 'volunteer' }).select('-password').lean();
    
    const volunteersWithStats = await Promise.all(volunteers.map(async (v) => {
      const total = await Donation.countDocuments({ claimedBy: v._id });
      const completed = await Donation.countDocuments({ claimedBy: v._id, status: 'completed' });
      return { ...v, totalTasks: total, completedTasks: completed };
    }));

    if (redis) await redis.setex(cacheKey, 60, JSON.stringify(volunteersWithStats));

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
