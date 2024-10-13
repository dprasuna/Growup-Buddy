const express = require('express');
const router = express.Router();
const Club = require('../models/club'); //  Club model
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

module.exports = router;
