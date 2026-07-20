const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth'); 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

// 1. LOGIN ROUTE
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin || !(await bcrypt.compare(password, admin.password))) 
      return res.status(400).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ admin: { id: admin.id } }, process.env.JWT_SECRET, { expiresIn: '10h' });
    res.json({ token });
  } catch (err) { res.status(500).send('Server error'); }
});

// 2. CHANGE PASSWORD ROUTE
router.post('/change-password', auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!(await bcrypt.compare(oldPassword, admin.password))) 
      return res.status(400).json({ message: 'Incorrect current password' });
    
    admin.password = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
    await admin.save();
    res.json({ message: 'Password updated successfully!' });
  } catch (err) { res.status(500).send('Server error'); }
});

// 3. FORGOT PASSWORD ROUTE
router.post('/forgot-password', async (req, res) => {
  const { username, email } = req.body;
  try {
    const authorizedEmail = 'rohitkr.kumar69@gmail.com';
    const normalizedEmail = (email || '').trim().toLowerCase();

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ message: 'Invalid username/email' });
    }

    if (normalizedEmail !== authorizedEmail) {
      return res.status(400).json({ message: 'Invalid username/email' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    admin.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    admin.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await admin.save();

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/admin/reset-password/${resetToken}`;
    console.log('RESET LINK FOR TESTING:', resetUrl);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: authorizedEmail,
      subject: 'Portfolio Admin - Password Reset',
      text: `Hello ${admin.username},\n\nReset your password here: ${resetUrl}\n\nThis link expires in 15 minutes.`,
    });

    res.json({ message: 'Reset link sent to your email!' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Email could not be sent' });
  }
});

// 4. RESET PASSWORD ROUTE
router.put('/reset-password/:token', async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const admin = await Admin.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
    if (!admin) return res.status(400).json({ message: 'Invalid or expired reset token' });
    
    admin.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
    await admin.save();
    res.json({ message: 'Password reset successful!' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;