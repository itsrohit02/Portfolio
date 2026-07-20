// server/models/Skill.js
const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    // enum: ['Frontend', 'Backend', 'Database', 'Tools', 'Languages'] // Helps organize them later
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Skill', SkillSchema);