const express = require('express');
const router = express.Router();
const Story = require('../models/story'); // Story model
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware

// POST /api/stories - Create a new story
router.post('/', authMiddleware, async (req, res) => {
  try {
    const story = new Story(req.body);
    await story.save();
    res.status(201).json(story);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/stories/recent - Get recent stories
router.get('/recent', authMiddleware, async (req, res) => {
  try {
    const recentStories = await Story.find().sort({ createdAt: -1 }).limit(10); // Get 10 most recent stories
    res.json(recentStories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stories/:id - Get a specific story by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ error: 'Story not found' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/stories/:id - Update a story by ID
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const story = await Story.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!story) return res.status(404).json({ error: 'Story not found' });
    res.json(story);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/stories/:id - Delete a story by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);
    if (!story) return res.status(404).json({ error: 'Story not found' });
    res.json({ message: 'Story deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
