// backend/controllers/donationController.js
const Donation = require('../models/Donation');
const User = require('../models/User'); // Required to find receivers
const nodemailer = require('nodemailer'); // Required for emails

// Configure Email Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Create a donation (donor only)
 */
exports.createDonation = async (req, res, next) => {
  try {
    // Auth
    if (!req.user || req.user.role !== 'donor') {
      return res.status(403).json({ message: 'Only donors can create donations' });
    }

    // Parsing logic (kept from your original code)
    const body = req.body || {};
    let pickupLocation = body.pickupLocation;
    if (typeof pickupLocation === 'string' && pickupLocation.trim()) {
      try {
        pickupLocation = JSON.parse(pickupLocation);
      } catch (err) {
        return res.status(400).json({ message: 'Invalid pickupLocation JSON' });
      }
    }

    const { title, description, foodType, quantity, pickupAddress, expiresAt } = body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    if (!pickupLocation || !Array.isArray(pickupLocation.coordinates) || pickupLocation.coordinates.length !== 2) {
      return res.status(400).json({ message: 'pickupLocation must be { type: "Point", coordinates: [lng, lat] }' });
    }

    // Image handling logic (kept from your original code)
    let images = [];
    if (Array.isArray(req.files) && req.files.length > 0) {
      images = req.files.map(f => `/uploads/${f.filename}`);
    } else {
      const possible = body.images || body['images[]'] || body.image || null;
      if (possible) {
        if (Array.isArray(possible)) images = possible;
        else if (typeof possible === 'string') {
          try {
            const parsed = JSON.parse(possible);
            images = Array.isArray(parsed) ? parsed : String(possible).split(',').map(s => s.trim());
          } catch (err) {
            images = String(possible).split(',').map(s => s.trim());
          }
        } else {
          images = [String(possible)];
        }
      }
    }
    images = (Array.isArray(images) ? images : []).map(String).map(s => s.trim()).filter(Boolean);

    // Save Donation
    const donation = new Donation({
      donorId: req.user.id,
      title,
      description,
      foodType,
      quantity: Number(quantity) || 1,
      pickupAddress,
      pickupLocation: {
        type: 'Point',
        coordinates: [
          parseFloat(pickupLocation.coordinates[0]),
          parseFloat(pickupLocation.coordinates[1])
        ]
      },
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      images,
      status: 'available' // Ensure status is available
    });

    await donation.save();

    // --- NEW: EMAIL NOTIFICATION TO ALL RECEIVERS ---
    try {
      const receivers = await User.find({ role: 'receiver', isVerified: true });
      const receiverEmails = receivers.map(u => u.email);

      if (receiverEmails.length > 0) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          bcc: receiverEmails, // Use BCC for privacy
          subject: `New Food Donation Alert: ${title}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
              <h2 style="color: #0F766E;">New Food Available!</h2>
              <p>A new donation <strong>"${title}"</strong> (${foodType}) has been posted.</p>
              <p><strong>Location:</strong> ${pickupAddress}</p>
              <p>Login to Annapoorna Connect to claim it before it's gone!</p>
              <a href="${process.env.CORS_ORIGIN}/foods" style="background-color: #0F766E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Donation</a>
            </div>
          `
        };
        // Send asynchronously to not block the response
        transporter.sendMail(mailOptions).catch(err => console.error("Email sending failed:", err));
      }
    } catch (emailErr) {
      console.error("Error sending receiver notifications:", emailErr);
    }
    // ------------------------------------------------

    console.log('Donation saved id:', donation._id);
    return res.status(201).json(donation);
  } catch (err) {
    console.error('createDonation error:', err);
    return next(err);
  }
};

/**
 * Get all donations
 */
exports.getDonations = async (req, res, next) => {
  try {
    const now = new Date();
    await Donation.updateMany(
      {
        expiresAt: { $exists: true, $lte: now },
        status: { $nin: ['expired', 'completed', 'cancelled'] }
      },
      { $set: { status: 'expired', updatedAt: now } }
    );
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    next(err);
  }
};

/**
 * Get nearby donations
 */
exports.getNearbyDonations = async (req, res, next) => {
  try {
    const { lat, lng, maxDistance = 10000 } = req.query;
    if (!lat || !lng) return res.status(400).json({ message: 'lat & lng required' });

    const now = new Date();
    await Donation.updateMany(
      {
        expiresAt: { $exists: true, $lte: now },
        status: { $nin: ['expired', 'completed', 'cancelled'] }
      },
      { $set: { status: 'expired', updatedAt: now } }
    );

    const donations = await Donation.find({
      status: 'available',
      pickupLocation: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance, 10)
        }
      }
    }).limit(50);
    res.json(donations);
  } catch (err) {
    next(err);
  }
};

/**
 * Receiver requests (accepts) a donation.
 */
exports.requestDonation = async (req, res, next) => {
  try {
    // 1. Find Donation
    const donation = await Donation.findById(req.params.id).populate('donorId'); // Populate to get Donor Email

    if (!donation) return res.status(404).json({ message: "Donation not found" });

    // Expiry check
    if (donation.expiresAt && new Date(donation.expiresAt) <= new Date()) {
      donation.status = 'expired';
      await donation.save();
      return res.status(400).json({ message: 'Donation already expired' });
    }

    if (donation.status !== "available") return res.status(400).json({ message: "Donation already taken" });

    // 2. Update Donation Status
    donation.receiverId = req.user.id;
    donation.status = "accepted";   
    donation.updatedAt = new Date();
    await donation.save();

    // --- NEW: EMAIL NOTIFICATION TO DONOR ---
    try {
      // Fetch full receiver details (Name, Phone, Email)
      const receiver = await User.findById(req.user.id);
      
      if (donation.donorId && donation.donorId.email) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: donation.donorId.email,
          subject: `Donation Claimed: ${donation.title}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
              <h2 style="color: #0F766E;">Good News! Your food has been claimed.</h2>
              <p><strong>Receiver Details:</strong></p>
              <ul>
                <li><strong>Name:</strong> ${receiver.name}</li>
                <li><strong>Phone:</strong> <a href="tel:${receiver.phone}">${receiver.phone}</a></li>
                <li><strong>Email:</strong> ${receiver.email}</li>
              </ul>
              <p>Please coordinate with them for the pickup.</p>
              <p><em>Thank you for saving food!</em></p>
            </div>
          `
        };
        await transporter.sendMail(mailOptions);
      }
    } catch (emailErr) {
      console.error("Error sending donor notification:", emailErr);
      // Don't fail the request if email fails, just log it
    }
    // ----------------------------------------

    res.json({ message: "Food accepted successfully", donation });
  } catch (err) {
    next(err);
  }
};

/**
 * Accept Request (matched -> accepted) logic
 */
exports.acceptRequest = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'donor') return res.status(403).json({ message: 'Only donors can accept requests' });
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    if (donation.donorId.toString() !== req.user.id) return res.status(403).json({ message: 'Not your donation' });
    if (donation.status !== 'matched') return res.status(400).json({ message: 'Donation must be matched before accepting' });

    if (donation.expiresAt && new Date(donation.expiresAt) <= new Date()) {
      donation.status = 'expired';
      await donation.save();
      return res.status(400).json({ message: 'Donation expired' });
    }

    donation.status = 'accepted';
    donation.updatedAt = new Date();
    await donation.save();
    res.json({ message: 'Donation accepted', donation });
  } catch (err) { next(err); }
};

/**
 * Update Status
 */
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    if (['picked_up','completed','cancelled','expired'].includes(status)) {
      if (!req.user || (req.user.role !== 'donor' && req.user.role !== 'admin')) return res.status(403).json({ message: 'Not authorized' });
      if (req.user.role === 'donor' && donation.donorId.toString() !== req.user.id) return res.status(403).json({ message: 'Not owner' });
    }

    donation.status = status;
    donation.updatedAt = new Date();
    await donation.save();
    res.json({ message: 'Status updated', donation });
  } catch (err) { next(err); }
};