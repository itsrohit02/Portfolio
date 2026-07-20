const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// GET all messages (Protected)
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.find().sort({ date: -1, _id: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a message (Protected)
// router.delete('/:id', auth, async (req, res) => {
//   try {
//     await Message.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Message deleted' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

router.post('/delete-many', auth, async (req, res) => {
  const { ids } = req.body;
  try {
    await Message.deleteMany({ _id: { $in: ids } });
    res.json({ message: 'Messages deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;