// server/routes/project.js
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth'); // Your VIP Bouncer

// 1. READ: Get all projects (PUBLIC ROUTE)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 2. CREATE: Add a new project (PROTECTED ROUTE)
router.post('/', auth, async (req, res) => {
  const { title, techStack, githubLink, liveLink, featured } = req.body;

  try {
    const newProject = new Project({
      title,
      techStack,
      githubLink,
      liveLink,
      featured
    });

    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 3. UPDATE: Edit an existing project (PROTECTED ROUTE)
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true } 
    );

    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 4. DELETE: Remove a project (PROTECTED ROUTE)
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;