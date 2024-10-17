const express = require('express');
const router = express.Router();
const Club = require('../models/club'); // Club model
const Story = require('../models/story'); // Story model
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware
const { validateClub } = require('../middleware/validateClub'); // Import validation middleware (if applicable)

// POST /api/clubs - Create a new club
router.post('/', authMiddleware, validateClub, async (req, res) => {
  try {
    const club = new Club(req.body);
    await club.save();
    res.status(201).json(club);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/clubs/recent - Get recent clubs for the homepage
router.get('/recent', authMiddleware, async (req, res) => {
  try {
    const recentClubs = await Club.find().sort({ createdAt: -1 }).limit(10); // Limit to the 10 most recent clubs
    res.json(recentClubs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/clubs - Get details of all clubs
router.get('/', authMiddleware, async (req, res) => {
  try {
    const clubs = await Club.find(); // Fetch all clubs
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/clubs/:id - Get details of a specific club by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ error: 'Club not found' });
    res.json(club);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/clubs/:id - Update a specific club by ID
router.put('/:id', authMiddleware, validateClub, async (req, res) => {
  try {
    const club = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!club) return res.status(404).json({ error: 'Club not found' });
    res.json(club);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/clubs/:id - Delete a club by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const club = await Club.findByIdAndDelete(req.params.id);
    if (!club) return res.status(404).json({ error: 'Club not found' });
    res.json({ message: 'Club deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stories Routes

// POST /api/clubs/:clubId/stories - Create a new story for a club
router.post('/:clubId/stories', authMiddleware, async (req, res) => {
  try {
    const story = new Story({
      club: req.params.clubId,
      ...req.body // Spread the request body into the Story model
    });
    await story.save();
    res.status(201).json(story);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/clubs/:clubId/stories - Get all stories for a specific club
router.get('/:clubId/stories', authMiddleware, async (req, res) => {
  try {
    const stories = await Story.find({ club: req.params.clubId }); // Fetch stories related to the specified club
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/clubs/:clubId/stories/:storyId - Update a specific story by ID
router.put('/:clubId/stories/:storyId', authMiddleware, async (req, res) => {
  try {
    const story = await Story.findByIdAndUpdate(req.params.storyId, req.body, { new: true });
    if (!story) return res.status(404).json({ error: 'Story not found' });
    res.json(story);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/clubs/:clubId/stories/:storyId - Delete a specific story by ID
router.delete('/:clubId/stories/:storyId', authMiddleware, async (req, res) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.storyId);
    if (!story) return res.status(404).json({ error: 'Story not found' });
    res.json({ message: 'Story deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
