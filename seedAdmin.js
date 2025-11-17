require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grimaldi_db';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(async ()=> {
  const username = 'AdminGrimaldi';
  const password = 'Grim2025*Admin';
  const existing = await User.findOne({ username });
  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }
  const hashed = await bcrypt.hash(password, 10);
  const u = new User({ username, password: hashed, role: 'admin' });
  await u.save();
  console.log('Created admin user:', username);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
