const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// GET coach profile
router.get('/coach/profile', protect, authorize('coach'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    return res.json({
      fullname: user.fullname,
      email: user.email,
      mainSport: user.sport || 'Basketball',
      position: 'Head Coach',
      sportParticipation: user.sportParticipation || []
    });
  } catch (error) {
    console.error('Coach profile error:', error);
    return res.status(500).json({ message: 'Server error while fetching coach profile' });
  }
});

// PUT coach profile updates (sport participation only)
router.put('/coach/profile', protect, authorize('coach'), async (req, res) => {
  try {
    const { sportParticipation } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    user.sportParticipation = Array.isArray(sportParticipation) ? sportParticipation : user.sportParticipation;
    await user.save();

    return res.json({ success: true, message: 'Coach profile updated successfully' });
  } catch (error) {
    console.error('Coach profile update error:', error);
    return res.status(500).json({ message: 'Server error while updating coach profile' });
  }
});

// GET coach updates / announcements
router.get('/coach/updates', protect, authorize('coach'), async (req, res) => {
  try {
    const updates = [
      { id: 1, title: 'Team 1 Basketball Team Training', date: 'January 23, 2026', time: '8AM - 10AM' },
      { id: 2, title: 'Intramural Requirements 2026', date: 'January 14, 2026', time: 'All Day' }
    ];
    return res.json(updates);
  } catch (error) {
    console.error('Coach updates error:', error);
    return res.status(500).json({ message: 'Server error while fetching coach updates' });
  }
});

module.exports = router;
