const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get admin dashboard stats
// @route   GET /api/v1/admin/dashboard
// @access  Private/Admin
router.get('/dashboard', protect, authorize('admin'), async (req, res) => {
  try {
    // Get counts from existing models only
    const totalAthletes = await User.countDocuments({ role: 'student' });
    const totalCoaches = await User.countDocuments({ role: 'coach' });
    const totalUsers = await User.countDocuments();
    const pendingRequirements = 0; // mock value until Requirement model exists
    
    // Temporary values for missing models
    const borrowedItems = 0;
    const totalEquipments = 0;
    const itemsOut = 0;
    
    // Get recent activities (last 5)
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('fullname role createdAt');
    
    const activities = [];
    
    recentUsers.forEach(user => {
      activities.push({
        id: `user-${user._id}`,
        action: `New ${user.role} registered: ${user.fullname}`,
        time: getTimeAgo(user.createdAt)
      });
    });
    
    // Temporary empty schedules
    const upcomingSchedules = [];

    res.json({
      stats: {
        totalAthletes,
        totalCoaches,
        totalUsers,
        pendingRequirements,
        borrowedItems,
        totalEquipments,
        itemsOut
      },
      activities: activities.slice(0, 5),
      upcomingSchedules
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper function to get time ago
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  
  return Math.floor(seconds) + ' seconds ago';
}

module.exports = router;