import Donation from '../models/DonationModel.js';

export const createDonation = async (req, res) => {
  try {
    // Add validation if needed
    const { donorId, foodName, quantity, pickupTime, location } = req.body;
    const newDonation = new Donation({
      donorId,
      foodName,
      quantity,
      pickupTime,
      location,
    });
    await newDonation.save();
    res.status(201).json({ message: 'Donation created successfully', newDonation });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find();
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
