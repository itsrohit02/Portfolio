// server/routes/skills.js
const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const auth = require('../middleware/auth');

// READ (Public)
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.json(skills);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// CREATE (Protected)
router.post('/', auth, async (req, res) => {
  try {
    const newSkill = new Skill(req.body);
    const skill = await newSkill.save();
    res.json(skill);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// UPDATE (Protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(skill);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// DELETE (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Skill deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;