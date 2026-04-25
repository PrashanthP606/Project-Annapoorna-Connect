// // routes/auth.js
// const express = require('express');
// const router = express.Router();

// // Import all functions including resetPassword
// const { 
//   register, 
//   login, 
//   verifyEmail, 
//   forgotPassword, 
//   resetPassword 
// } = require('../controllers/authController');

// router.post('/register', register);
// router.post('/login', login);
// router.get('/verify-email', verifyEmail);
// router.post('/forgot-password', forgotPassword);

// // --- ADDED THIS ROUTE ---
// router.post('/reset-password/:token', resetPassword);

// module.exports = router;

const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

const { 
  register, 
  login, 
  verifyEmail, 
  forgotPassword, 
  resetPassword 
} = require('../controllers/authController');

// statistics updation
router.get('/stats', statsController.getImpactStats); 
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;