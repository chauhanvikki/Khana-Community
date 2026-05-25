
import Donation from '../models/DonationModel.js';
import User from '../models/userModel.js';

// Helper to send notifications via socket
const sendNotification = (req, targetRoom, data) => {
  const io = req.app.get('io');
  if (io) {
    io.to(targetRoom).emit('notification', {
      ...data,
      time: new Date().toISOString()
    });
  }
};

// Create a new donation
export const createDonation = async (req, res) => {
  try {
    const { foodName, quantity, pickupDate, phoneNo, location, imageUrl } = req.body;

    if (!foodName || !quantity || !pickupDate || !phoneNo || !location) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    if (!/^[0-9]{10}$/.test(phoneNo)) {
      return res.status(400).json({ message: 'Invalid phone number format.' });
    }

    const newDonation = new Donation({
      donorId: req.user.id,
      foodName,
      quantity,
      pickupDate,
      phoneNo,
      location,
      imageUrl,
    });

    await newDonation.save();

    // NOTIFY ALL VOLUNTEERS
    sendNotification(req, 'volunteers', {
      type: 'info',
      title: '🍱 New Donation Available!',
      message: `A new donation of ${foodName} is available at ${location}. Accept it if you are nearby!`,
      senderName: 'System',
      senderRole: 'admin'
    });

    res.status(201).json({ message: 'Donation created successfully.', donation: newDonation });
  } catch (error) {
    res.status(500).json({ message: 'Error creating donation', error: error.message });
  }
};

// Get all donations
export const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donorId', 'name email profileImage')
      .populate('claimedBy', 'name email profileImage');
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donations', error: error.message });
  }
};

// Get donations by donor
export const getDonationsByDonor = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const donations = await Donation.find({ donorId: req.user.id })
      .populate("claimedBy", "name email profileImage")
      .populate("donorId", "name email phone profileImage");
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donor donations', error: error.message });
  }
};

// Volunteer claims a donation
export const claimDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donorId', 'name email profileImage');

    if (!donation) return res.status(404).json({ message: 'Donation not found.' });
    if (donation.status !== 'available') return res.status(400).json({ message: 'Already claimed.' });

    donation.claimedBy = req.user.id;
    donation.status = 'claimed';
    await donation.save();

    const updatedDonation = await Donation.findById(donation._id)
      .populate('claimedBy', 'name email profileImage')
      .populate('donorId', 'name email profileImage');

    // NOTIFY DONOR
    sendNotification(req, donation.donorId._id.toString(), {
      type: 'info',
      title: '🤝 Task Accepted!',
      message: `Your donation of ${donation.foodName} has been accepted by ${req.user.name}. Thank you for your kindness!`,
      senderName: req.user.name,
      senderRole: 'volunteer'
    });

    res.status(200).json({ message: 'Donation claimed successfully.', donation: updatedDonation });
  } catch (error) {
    res.status(500).json({ message: 'Error claiming donation', error: error.message });
  }
};

// Mark as delivered
export const markAsDelivered = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donorId', 'name email profileImage')
      .populate('claimedBy', 'name email profileImage');

    if (!donation) return res.status(404).json({ message: 'Donation not found.' });
    if (donation.status !== 'claimed') return res.status(400).json({ message: 'Invalid status.' });
    if (donation.claimedBy._id.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized.' });

    donation.status = 'delivered';
    await donation.save();

    // NOTIFY DONOR
    sendNotification(req, donation.donorId._id.toString(), {
      type: 'info',
      title: '🚚 Food Delivered!',
      message: `The food (${donation.foodName}) has been successfully delivered by ${req.user.name}.`,
      senderName: req.user.name,
      senderRole: 'volunteer'
    });

    res.status(200).json({ message: 'Marked as delivered.', donation });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

// Complete donation
export const completeDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donorId', 'name email')
      .populate('claimedBy', 'name email');

    if (!donation) return res.status(404).json({ message: 'Donation not found.' });

    donation.status = 'completed';
    await donation.save();

    // NOTIFY BOTH (optional)
    const msg = `The donation of ${donation.foodName} is now officially completed. Great job everyone!`;
    sendNotification(req, donation.donorId._id.toString(), { type: 'success', title: '✅ Donation Completed', message: msg, senderName: 'System' });
    if (donation.claimedBy) {
      sendNotification(req, donation.claimedBy._id.toString(), { type: 'success', title: '✅ Task Completed', message: msg, senderName: 'System' });
    }

    res.status(200).json({ message: 'Completed.', donation });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

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

export const getAvailableDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ status: "available" })
      .populate("donorId", "name email phone profileImage");
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Donation.aggregate([
      { $group: { _id: "$donorId", donationCount: { $sum: 1 } } },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "donorDetails" } },
      { $unwind: "$donorDetails" },
      { $match: { "donorDetails.role": "donor" } },
      { $sort: { donationCount: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 1, donationCount: 1,
          name: "$donorDetails.name",
          profileImage: "$donorDetails.profileImage"
        }
      }
    ]);
    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};
