const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const auth = require('../middleware/auth');

// GET Profile (Public) - Creates default if none exists
router.get('/', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({}); // Creates document with schema defaults
    }
    res.json(profile);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// UPDATE Profile (Protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Profile.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;