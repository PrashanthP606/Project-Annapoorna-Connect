// // models/User.js
// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['donor', 'receiver', 'admin'], required: true },
//   phone: String,
//   address: String,
  
//   // --- NEW FIELDS FOR EMAIL VERIFICATION ---
//   isVerified: { 
//     type: Boolean, 
//     default: false 
//   },
//   verificationToken: { 
//     type: String 
//   },
//   resetPasswordToken: String,
//   resetPasswordExpires: Date,
//   // -----------------------------------------

//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['donor', 'receiver', 'admin'], required: true },
  phone: String,
  address: String,
  
  // --- Fields for Email Verification ---
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  
  // --- Fields for Password Reset ---
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);