
import Donation from '../models/DonationModel.js';
import User from '../models/userModel.js';
import redis from '../utils/redis.js';

const CACHE_TTL = 60;

const sendNotification = (req, targetRoom, data) => {
  const io = req.app.get('io');
  if (io) {
    io.to(targetRoom).emit('notification', { ...data, time: new Date().toISOString() });
  }
};

// ─── Haversine distance in km ───────────────────────────────────────────────
const haversine = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
};

// ─── Create donation ─────────────────────────────────────────────────────────
export const createDonation = async (req, res) => {
  try {
    const { foodName, quantity, pickupDate, phoneNo, location, imageUrl, coordinates } = req.body;

    if (!foodName || !quantity || !pickupDate || !phoneNo || !location) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }
    if (!/^[0-9]{10}$/.test(phoneNo)) {
      return res.status(400).json({ message: 'Invalid phone number format.' });
    }

    const donationData = {
      donorId: req.user.id,
      foodName, quantity, pickupDate, phoneNo, location, imageUrl,
    };

    // Store GeoJSON only if valid coordinates provided
    if (coordinates?.lat && coordinates?.lng) {
      const lat = parseFloat(coordinates.lat);
      const lng = parseFloat(coordinates.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        donationData.coordinates = {
          type: 'Point',
          coordinates: [lng, lat],
        };
      }
    }

    const newDonation = await new Donation(donationData).save();

    if (redis) await redis.del('donations:all', 'donations:available', 'admin:stats');

    sendNotification(req, 'volunteers', {
      type: 'info',
      title: '🍱 New Donation Available!',
      message: `A new donation of ${foodName} is available at ${location}. Accept it if you are nearby!`,
      senderName: 'System',
      senderRole: 'admin',
    });

    res.status(201).json({ message: 'Donation created successfully.', donation: newDonation });
  } catch (error) {
    console.error('Create donation error:', error.message, error.stack);
    res.status(500).json({ message: 'Error creating donation', error: error.message });
  }
};

// ─── Get all donations ───────────────────────────────────────────────────────
export const getDonations = async (req, res) => {
  try {
    const cacheKey = 'donations:all';
    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) return res.status(200).json(JSON.parse(cached));
    }
    const donations = await Donation.find()
      .populate('donorId', 'name email profileImage')
      .populate('claimedBy', 'name email profileImage');
    if (redis) await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(donations));
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donations', error: error.message });
  }
};

// ─── Donor's own donations ───────────────────────────────────────────────────
export const getDonationsByDonor = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
    const donations = await Donation.find({ donorId: req.user.id })
      .populate('claimedBy', 'name email profileImage')
      .populate('donorId', 'name email phone profileImage');
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donor donations', error: error.message });
  }
};

// ─── Nearby donations (geospatial) ──────────────────────────────────────────
export const getNearbyDonations = async (req, res) => {
  try {
    const { lat, lng, maxDistance = 10000 } = req.query; // maxDistance in meters, default 10km

    if (!lat || !lng) {
      return res.status(400).json({ message: 'lat and lng query params are required' });
    }

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    // Try geospatial query first (only works for donations WITH coordinates)
    let geoResults = [];
    try {
      geoResults = await Donation.find({
        status: { $in: ['available'] },
        coordinates: {
          $near: {
            $geometry: { type: 'Point', coordinates: [parsedLng, parsedLat] },
            $maxDistance: parseFloat(maxDistance),
          },
        },
      }).populate('donorId', 'name email phone profileImage');
    } catch (_) {
      // Index may not exist yet — fall through to fallback
    }

    // Attach distance to geo results
    const withDistance = geoResults.map((d) => {
      const [dLng, dLat] = d.coordinates.coordinates;
      return {
        ...d.toObject(),
        distanceKm: haversine(parsedLat, parsedLng, dLat, dLng),
        hasCoords: true,
      };
    });

    // Fallback: also include available donations WITHOUT coordinates
    const noCoordResults = await Donation.find({
      status: 'available',
      $or: [{ coordinates: { $exists: false } }, { 'coordinates.coordinates': { $size: 0 } }],
    }).populate('donorId', 'name email phone profileImage');

    const withoutDistance = noCoordResults.map((d) => ({
      ...d.toObject(),
      distanceKm: null,
      hasCoords: false,
    }));

    // Nearby first (sorted by MongoDB $near), then no-coord donations
    const combined = [...withDistance, ...withoutDistance];

    res.json(combined);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching nearby donations', error: error.message });
  }
};

// ─── Accept donation (available → accepted) ──────────────────────────────────
export const claimDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donorId', 'name email profileImage');

    if (!donation) return res.status(404).json({ message: 'Donation not found.' });
    if (!['available'].includes(donation.status)) {
      return res.status(400).json({ message: 'This donation is no longer available.' });
    }

    donation.claimedBy = req.user.id;
    donation.status = 'accepted';
    donation.acceptedAt = new Date();
    await donation.save();

    if (redis) {
      try { await redis.del('donations:all', 'donations:available'); } catch (_) {}
    }

    const updated = await Donation.findById(donation._id)
      .populate('claimedBy', 'name email profileImage')
      .populate('donorId', 'name email profileImage');

    // Notify donor via Socket.IO room (their userId)
    sendNotification(req, donation.donorId._id.toString(), {
      type: 'info',
      title: '🤝 Donation Accepted!',
      message: `${req.user.name} has accepted your donation of ${donation.foodName} and is on the way!`,
      senderName: req.user.name,
      senderRole: 'volunteer',
    });

    // Broadcast status change to tracking room
    const io = req.app.get('io');
    if (io) io.to(`donation:${donation._id}`).emit('status:change', { status: 'accepted', donationId: donation._id });

    res.status(200).json({ message: 'Donation accepted.', donation: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting donation', error: error.message });
  }
};

// ─── Start journey (accepted → en_route) ────────────────────────────────────
export const startJourney = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate('donorId', 'name _id');
    if (!donation) return res.status(404).json({ message: 'Donation not found.' });
    if (donation.status !== 'accepted') return res.status(400).json({ message: 'Invalid status transition.' });
    if (donation.claimedBy?.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized.' });

    donation.status = 'en_route';
    await donation.save();

    if (redis) await redis.del('donations:all');

    sendNotification(req, donation.donorId._id.toString(), {
      type: 'info',
      title: '🚗 Volunteer En Route!',
      message: `${req.user.name} has started traveling to pick up your donation of ${donation.foodName}.`,
      senderName: req.user.name,
      senderRole: 'volunteer',
    });

    const io = req.app.get('io');
    if (io) io.to(`donation:${donation._id}`).emit('status:change', { status: 'en_route', donationId: donation._id });

    res.status(200).json({ message: 'Journey started.', donation });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

// ─── Mark arrived (en_route → arrived) ──────────────────────────────────────
export const markArrived = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate('donorId', 'name _id');
    if (!donation) return res.status(404).json({ message: 'Donation not found.' });
    if (donation.status !== 'en_route') return res.status(400).json({ message: 'Invalid status transition.' });
    if (donation.claimedBy?.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized.' });

    donation.status = 'arrived';
    await donation.save();

    sendNotification(req, donation.donorId._id.toString(), {
      type: 'info',
      title: '📍 Volunteer Arrived!',
      message: `${req.user.name} has arrived at your location to pick up ${donation.foodName}.`,
      senderName: req.user.name,
      senderRole: 'volunteer',
    });

    const io = req.app.get('io');
    if (io) io.to(`donation:${donation._id}`).emit('status:change', { status: 'arrived', donationId: donation._id });

    res.status(200).json({ message: 'Marked as arrived.', donation });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

// ─── Mark picked up (arrived → picked_up) ───────────────────────────────────
export const markAsDelivered = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donorId', 'name _id')
      .populate('claimedBy', 'name _id');

    if (!donation) return res.status(404).json({ message: 'Donation not found.' });

    // Allow from 'arrived' or legacy 'claimed' (backward compat)
    const validFrom = ['arrived', 'claimed', 'accepted', 'en_route'];
    if (!validFrom.includes(donation.status)) {
      return res.status(400).json({ message: 'Invalid status transition.' });
    }
    if (donation.claimedBy._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }

    donation.status = 'picked_up';
    donation.pickedUpAt = new Date();
    await donation.save();

    // Save last known volunteer location from Redis to donation
    if (redis) {
      try {
        const cached = await redis.get(`tracking:${donation._id}`);
        if (cached) {
          const loc = JSON.parse(cached);
          await Donation.findByIdAndUpdate(donation._id, {
            lastKnownLocation: { lat: loc.lat, lng: loc.lng },
          });
        }
      } catch (_) {}
      await redis.del('donations:all');
    }

    sendNotification(req, donation.donorId._id.toString(), {
      type: 'success',
      title: '📦 Food Picked Up!',
      message: `${req.user.name} has picked up your donation of ${donation.foodName}. Mission almost complete!`,
      senderName: req.user.name,
      senderRole: 'volunteer',
    });

    const io = req.app.get('io');
    if (io) io.to(`donation:${donation._id}`).emit('status:change', { status: 'picked_up', donationId: donation._id });

    res.status(200).json({ message: 'Marked as picked up.', donation });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

// ─── Complete donation (picked_up → completed) ───────────────────────────────
export const completeDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donorId', 'name email')
      .populate('claimedBy', 'name email');

    if (!donation) return res.status(404).json({ message: 'Donation not found.' });

    donation.status = 'completed';
    donation.completedAt = new Date();
    await donation.save();

    if (redis) {
      try { await redis.del('donations:all', 'donations:available', `tracking:${donation._id}`); } catch (_) {}
    }

    sendNotification(req, donation.donorId._id.toString(), {
      type: 'success', title: '✅ Donation Completed',
      message: `Your donation of ${donation.foodName} has been successfully completed. Thank you!`,
      senderName: 'System',
    });

    if (donation.claimedBy) {
      sendNotification(req, donation.claimedBy._id.toString(), {
        type: 'success', title: '✅ Mission Complete!',
        message: `You have successfully completed the delivery of ${donation.foodName}. Amazing work!`,
        senderName: 'System',
      });
    }

    const io = req.app.get('io');
    if (io) io.to(`donation:${donation._id}`).emit('status:change', { status: 'completed', donationId: donation._id });

    res.status(200).json({ message: 'Completed.', donation });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

// ─── Volunteer's accepted donations ─────────────────────────────────────────
export const getVolunteerDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ claimedBy: req.user.id })
      .populate('donorId', 'name email phone profileImage')
      .populate('claimedBy', 'name email profileImage');
    res.status(200).json(donations);
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};

// ─── Available donations (with Redis cache) ──────────────────────────────────
export const getAvailableDonations = async (req, res) => {
  try {
    const cacheKey = 'donations:available';
    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) return res.json(JSON.parse(cached));
    }
    const donations = await Donation.find({ status: 'available' })
      .populate('donorId', 'name email phone profileImage');
    if (redis) await redis.setex(cacheKey, 10, JSON.stringify(donations));
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Get live tracking location from Redis ───────────────────────────────────
export const getTrackingLocation = async (req, res) => {
  try {
    if (!redis) return res.json({ location: null });
    const data = await redis.get(`tracking:${req.params.id}`);
    res.json({ location: data ? JSON.parse(data) : null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Leaderboard ─────────────────────────────────────────────────────────────
export const getLeaderboard = async (req, res) => {
  try {
    const cacheKey = 'donations:leaderboard';
    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) return res.status(200).json(JSON.parse(cached));
    }
    const leaderboard = await Donation.aggregate([
      { $group: { _id: '$donorId', donationCount: { $sum: 1 } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'donorDetails' } },
      { $unwind: '$donorDetails' },
      { $match: { 'donorDetails.role': 'donor' } },
      { $sort: { donationCount: -1 } },
      { $limit: 10 },
      { $project: { _id: 1, donationCount: 1, name: '$donorDetails.name', profileImage: '$donorDetails.profileImage' } },
    ]);
    if (redis) await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(leaderboard));
    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};
