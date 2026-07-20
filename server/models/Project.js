// server/models/Project.js
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  techStack: { 
    type: [String], 
    required: true 
  },
  githubLink: { 
    type: String 
  },
  liveLink: { 
    type: String 
  },
  featured: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Project', ProjectSchema);