// import { createDonation } from '../controllers/donationController.js';
// import express from 'express';
// import { getDonations } from '../controllers/donationController.js';

// const router = express.Router();

// router.post('/', createDonation);
// router.get('/', getDonations);

// export default router;


import express from 'express';
import { createDonation, getDonations } from '../controllers/donationController.js';

const router = express.Router();

router.post('/', createDonation);
router.get('/', getDonations);

export default router;
