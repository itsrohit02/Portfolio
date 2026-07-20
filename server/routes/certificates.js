// server/routes/certificates.js
const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const auth = require('../middleware/auth');

// READ (Public)
router.get('/', async (req, res) => {
  try {
    const certs = await Certificate.find().sort({ createdAt: -1 });
    res.json(certs);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// CREATE (Protected)
router.post('/', auth, async (req, res) => {
  try {
    const newCert = new Certificate(req.body);
    const cert = await newCert.save();
    res.json(cert);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// UPDATE (Protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const cert = await Certificate.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true }
    );
    res.json(cert);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// DELETE (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Certificate deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;