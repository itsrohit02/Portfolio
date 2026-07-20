// server/setupAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

const createAdmin = async () => {
  await connectDB();

  try {
    // 1. Check if an admin already exists
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (adminExists) {
      console.log('Admin already exists! You are good to go.');
      process.exit();
    }

    // 2. Hash your secure password
    // IMPORTANT: Change 'your_secure_password' to whatever password you want to use to log in!
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('your_secure_password', salt);

    // 3. Save the Admin to the database
    const admin = new Admin({
      username: 'admin',
      password: hashedPassword,
    });

    await admin.save();
    console.log('✅ Admin user created successfully! You can now log into your dashboard.');
    process.exit();

  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();