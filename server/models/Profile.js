const mongoose = require('mongoose');

// We use a sub-schema for stats so we can have an array of them
const StatSchema = new mongoose.Schema({
  num: String,
  label: String
});

const ProfileSchema = new mongoose.Schema({
  // This is the new field for your Hero section!
  heroText: {
    type: String,
    default: "Aspiring full-stack developer with a growing focus on AI-driven products — I care about clean architecture as much as sharp UI, and I build things end to end."
  },
  headline: { 
    type: String, 
    default: "A developer shaped by <em class='italic text-[#c2703f]'>Rajasthan's</em> craft of structure." 
  },
  bio1: { 
    type: String, 
    default: "I'm a Computer Science (AI) undergraduate, currently maintaining an 8.33 CGPA, expected to graduate in May 2027." 
  },
  bio2: { 
    type: String, 
    default: "My work spans the full stack — React, Node.js, Express, and databases — with a growing interest in generative AI." 
  },
  softSkills: { 
    type: [String], 
    default: ["Effective Communication", "Team Collaboration", "Time Management", "Digital Productivity"] 
  },
  hobbies: { 
    type: [String], 
    default: ["Travelling", "Online Gaming", "Music Listening", "Movie Dialogue Mimicry"] 
  },
  stats: {
    type: [StatSchema],
    default: [
      { num: "8.33", label: "Current CGPA" },
      { num: "9+", label: "Projects Shipped" },
      { num: "7", label: "Certifications" },
      { num: "2027", label: "Expected Graduation" }
    ]
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Profile', ProfileSchema);