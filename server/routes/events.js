const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });
  res.json(events);
});

router.post('/', auth, async (req, res) => {
  const newEvent = new Event(req.body);
  res.json(await newEvent.save());
});

router.put('/:id', auth, async (req, res) => {
  const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', auth, async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;