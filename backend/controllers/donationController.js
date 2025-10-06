
import Donation from '../models/DonationModel.js';
import User from '../models/userModel.js';

// Create a new donation
export const createDonation = async (req, res) => {
  try {
    const { foodName, quantity, pickupDate, phoneNo, location, imageUrl } = req.body;

    if (!foodName || !quantity || !pickupDate || !phoneNo || !location) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    // Validate phone number (must be 10 digits)
    if (!/^[0-9]{10}$/.test(phoneNo)) {
      return res.status(400).json({ message: 'Invalid phone number format.' });
    }

    const newDonation = new Donation({
      // donorId: req.body.donorId, // from auth middleware
      // donorName: req.body.donorName,
      donorId: req.user.id,       // from JWT
      // donorName: req.user.name,   // from JWT
      foodName,
      quantity,
      pickupDate,
      phoneNo,
      location,
      imageUrl,
    });

    console.log("Saving donation:", newDonation);

    await newDonation.save();
    res.status(201).json({ message: 'Donation created successfully.', donation: newDonation });
  } catch (error) {
    res.status(500).json({ message: 'Error creating donation', error: error.message });
  }
};

// Get all donations (for admin/volunteers)
export const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donorId', 'name email')
      .populate('claimedBy', 'name email');
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donations', error: error.message });
  }
};

// Get donations by donor (for donors to track their donations)
export const getDonationsByDonor = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const donations = await Donation.find({ donorId: req.user.id })
      .populate("claimedBy", "name email")
      .populate("donorId", "name email phone");
    
    res.status(200).json(donations);
  } catch (error) {
    console.error('Error fetching donor donations:', error);
    res.status(500).json({ message: 'Error fetching donor donations', error: error.message });
  }
};

// Volunteer claims a donation
export const claimDonation = async (req, res) => {
  try {
    if (!req.params.id || !req.user?.id) {
      return res.status(400).json({ message: 'Invalid request parameters.' });
    }

    const donation = await Donation.findById(req.params.id)
    .populate("claimedBy", "name email");

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found.' });
    }

    if (donation.status !== 'available') {
      return res.status(400).json({ message: 'Donation already claimed or completed.' });
    }

    donation.claimedBy = req.user.id;
    donation.status = 'claimed';
    await donation.save();

    const updatedDonation = await Donation.findById(donation._id)
      .populate('claimedBy', 'name email') // volunteer details
      .populate('donorId', 'name email'); // donor details

    // await donation.save();
    res.status(200).json({ message: 'Donation claimed successfully.', donation : updatedDonation  });
  } catch (error) {
    res.status(500).json({ message: 'Error claiming donation', error: error.message });
  }
};

// Mark donation as completed (Admin/Volunteer)
export const completeDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found.' });
    }

    if (donation.status !== 'claimed') {
      return res.status(400).json({ message: 'Donation must be claimed before completion.' });
    }

    donation.status = 'completed';
    await donation.save();

    res.status(200).json({ message: 'Donation marked as completed.', donation });
  } catch (error) {
    res.status(500).json({ message: 'Error completing donation', error: error.message });
  }
};


// Get donations claimed by logged-in volunteer
export const getVolunteerDonations = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const donations = await Donation.find({ claimedBy: req.user.id })
      .populate('donorId', 'name email phone')
      .populate('claimedBy', 'name email');

    res.status(200).json(donations);
  } catch (err) {
    console.error('Error fetching volunteer donations:', err);
    res.status(500).json({ message: 'Error fetching volunteer donations', error: err.message });
  }
};


// controllers/donationController.js
// ✅ New controller
export const getAvailableDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ status: "available" })
      .populate("donorId", "name email phone");
    console.log('Available donations:', donations);
    res.json(donations);
  } catch (err) {
    console.error('Error in getAvailableDonations:', err);
    res.status(500).json({ error: err.message });
  }
};
