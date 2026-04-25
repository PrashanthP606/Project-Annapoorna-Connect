// controllers/statsController.js
const User = require('../models/User');
const Donation = require('../models/Donation'); // Assuming you have this model

exports.getImpactStats = async (req, res) => {
  try {
    // 1. People Connected: Count ALL users (Donors + Receivers)
    const totalUsers = await User.countDocuments({});

    // 2. Total Donations: Count ALL donation posts created
    const totalDonations = await Donation.countDocuments({});

    // 3. People Served: Count donations that have been claimed
    // We count documents where status is NOT 'available' (meaning it's accepted, picked_up, or completed)
    const servedCount = await Donation.countDocuments({
      status: { $in: ['accepted', 'picked_up', 'completed'] }
    });

    res.status(200).json({
      connected: totalUsers,
      donations: totalDonations,
      served: servedCount
    });

  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: "Error fetching stats" });
  }
};