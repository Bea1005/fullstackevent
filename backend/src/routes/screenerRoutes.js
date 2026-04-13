const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');

// @desc    Get screener dashboard data (SIMPLIFIED - NO REQUIREMENTS DB)
// @route   GET /api/v1/screener/dashboard
// @access  Private/Screener
router.get('/screener/dashboard', protect, authorize('screener'), async (req, res) => {
  try {
    // Get total students count from users collection only
    const totalStudents = await User.countDocuments({ role: 'student' });
    
    // Mock data for requirements (no database connection yet)
    const mockPendingRequirements = 5;
    const mockVerifiedRequirements = 3;
    
    res.json({
      success: true,
      message: 'Welcome to Screener Dashboard',
      user: req.user,
      stats: {
        pendingRequirements: mockPendingRequirements,
        verifiedRequirements: mockVerifiedRequirements,
        totalStudents: totalStudents
      }
    });
  } catch (error) {
    console.error('Screener dashboard error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @desc    Get all students (from users collection only)
// @route   GET /api/v1/screener/students
// @access  Private/Screener
router.get('/screener/students', protect, authorize('screener'), async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    // Format students without requirements DB
    const formattedStudents = students.map(student => ({
      id: student._id,
      fullname: student.fullname,
      username: student.username,
      email: student.email,
      department: student.department || 'Not specified',
      sport: student.sport || 'Not specified',
      studentId: student.studentId || 'Not set',
      // Mock requirement status (no database yet)
      requirements: {
        cor: 'pending',
        med: 'pending',
        psa: 'pending'
      },
      verificationStatus: 'pending'
    }));
    
    res.json(formattedStudents);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @desc    Verify student requirement (MOCK - no database yet)
// @route   PUT /api/v1/screener/verify/:studentId
// @access  Private/Screener
router.put('/screener/verify/:studentId', protect, authorize('screener'), async (req, res) => {
  try {
    const { studentId } = req.params;
    const { status } = req.body;
    
    // Just return success without database
    res.json({
      success: true,
      message: `Student requirement ${status} (Demo mode - no database yet)`,
      studentId,
      status
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @desc    Get requirement statistics (MOCK)
// @route   GET /api/v1/screener/statistics
// @access  Private/Screener
router.get('/screener/statistics', protect, authorize('screener'), async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    
    res.json({
      success: true,
      stats: {
        totalStudents: totalStudents,
        submittedRequirements: 0,
        pendingRequirements: 0,
        verifiedRequirements: 0,
        rejectedRequirements: 0,
        completionRate: 0
      }
    });
  } catch (error) {
    console.error('Statistics error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;