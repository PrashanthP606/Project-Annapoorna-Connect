const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// donor creates donation
router.post('/', auth('donor'),upload.array('images', 6), donationController.createDonation);

// list all (public)
router.get('/', donationController.getDonations);

// nearby (receiver)
router.get('/nearby', auth('receiver'), donationController.getNearbyDonations);

// receiver requests a donation
router.post('/:id/request', auth('receiver'), donationController.requestDonation);

// donor accepts request
router.post('/:id/accept', auth('donor'), donationController.acceptRequest);

// update status (donor/admin)
router.patch('/:id/status', auth(['donor','admin']), donationController.updateStatus);

module.exports = router;
