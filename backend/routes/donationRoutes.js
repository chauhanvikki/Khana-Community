// routes/donationRoutes.js
import authMiddleware from "../Middlewares/authMiddleware.js";
import express from 'express';
import Donation from "../models/DonationModel.js";

import {
  createDonation,
  getDonations,
  claimDonation,
  getDonationsByDonor,
  completeDonation,
  getAvailableDonations,
  getVolunteerDonations
} from "../controllers/donationController.js";

const router = express.Router();


router.post('/', authMiddleware, createDonation);
router.get('/', authMiddleware, getDonations);
router.get('/my-donations', authMiddleware, getDonationsByDonor);
router.put('/:id/claim', authMiddleware, claimDonation);
router.put('/:id/complete', authMiddleware, completeDonation);
router.get("/available", authMiddleware, getAvailableDonations);

// Get donations claimed by logged-in volunteer
router.get("/volunteer", authMiddleware, getVolunteerDonations);

export default router;
