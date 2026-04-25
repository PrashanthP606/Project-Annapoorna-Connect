require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  try {
    console.log('Using MONGO_URI =', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected OK to MongoDB');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Connect error:', err);
    process.exit(1);
  }
})();
