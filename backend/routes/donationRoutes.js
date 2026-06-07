// routes/donationRoutes.js
import authMiddleware from '../Middlewares/authMiddleware.js';
import express from 'express';
import {
  createDonation,
  getDonations,
  claimDonation,
  getDonationsByDonor,
  completeDonation,
  getAvailableDonations,
  getVolunteerDonations,
  markAsDelivered,
  getLeaderboard,
  getNearbyDonations,
  startJourney,
  markArrived,
  getTrackingLocation,
} from '../controllers/donationController.js';

const router = express.Router();

// Public
router.get('/leaderboard', getLeaderboard);

// Donor
router.post('/', authMiddleware, createDonation);
router.get('/my-donations', authMiddleware, getDonationsByDonor);

// Volunteer \u2014 nearby geospatial search (must come before /:id routes)
router.get('/nearby', authMiddleware, getNearbyDonations);
router.get('/available', authMiddleware, getAvailableDonations);
router.get('/volunteer', authMiddleware, getVolunteerDonations);

// All donations
router.get('/', authMiddleware, getDonations);

// Status transitions
router.put('/:id/claim', authMiddleware, claimDonation);       // accept
router.put('/:id/start', authMiddleware, startJourney);        // en_route
router.put('/:id/arrive', authMiddleware, markArrived);        // arrived
router.put('/:id/deliver', authMiddleware, markAsDelivered);   // picked_up
router.put('/:id/complete', authMiddleware, completeDonation); // completed

// Live tracking location from Redis
router.get('/:id/tracking', authMiddleware, getTrackingLocation);

export default router;
