const express = require('express');
const router = express.Router();
const Borrowing = require('../models/Borrowing');
const Equipment = require('../models/Equipment');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all borrowing records
// @route   GET /api/v1/admin/borrowing
// @access  Private/Admin
router.get('/admin/borrowing', protect, authorize('admin'), async (req, res) => {
  try {
    const borrowings = await Borrowing.find()
      .sort({ borrowDate: -1 });
    
    res.json(borrowings.map(b => ({
      id: b._id,
      Name: b.Name,
      equipment: b.equipment,
      quantity: b.quantity,
      date: b.borrowDate ? b.borrowDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      status: b.status
    })));
  } catch (error) {
    console.error('Get borrowing records error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new borrowing transaction
// @route   POST /api/v1/admin/borrowing
// @access  Private/Admin
router.post('/admin/borrowing', protect, authorize('admin'), async (req, res) => {
  try {
    const { Name, equipment, quantity } = req.body;
    
    // Validate required fields
    if (!Name || !equipment || !quantity) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }
    
    // Find equipment to update stock
    const equipmentItem = await Equipment.findOne({ name: equipment });
    
    if (equipmentItem) {
      // Check if enough stock is available
      if (equipmentItem.available < quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock. Only ${equipmentItem.available} available.` 
        });
      }
      
      // Update equipment stock
      equipmentItem.onLoan += quantity;
      await equipmentItem.save();
    }
    
    // Create borrowing record
    const borrowing = await Borrowing.create({
      Name,
      equipment,
      quantity,
      borrowedBy: req.user.id,
      status: 'Out Now',
      borrowDate: new Date()
    });
    
    res.status(201).json({
      id: borrowing._id,
      Name: borrowing.Name,
      equipment: borrowing.equipment,
      quantity: borrowing.quantity,
      date: borrowing.borrowDate.toISOString().split('T')[0],
      status: borrowing.status
    });
  } catch (error) {
    console.error('Create borrowing error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Return item (update status to Completed)
// @route   PUT /api/v1/admin/borrowing/:id/return
// @access  Private/Admin
router.put('/admin/borrowing/:id/return', protect, authorize('admin'), async (req, res) => {
  try {
    const borrowing = await Borrowing.findById(req.params.id);
    
    if (!borrowing) {
      return res.status(404).json({ message: 'Borrowing record not found' });
    }
    
    if (borrowing.status === 'Completed') {
      return res.status(400).json({ message: 'Item already returned' });
    }
    
    // Update equipment stock if it exists
    const equipmentItem = await Equipment.findOne({ name: borrowing.equipment });
    if (equipmentItem) {
      equipmentItem.onLoan -= borrowing.quantity;
      await equipmentItem.save();
    }
    
    // Update borrowing record
    borrowing.status = 'Completed';
    borrowing.returnedAt = new Date();
    await borrowing.save();
    
    res.json({
      id: borrowing._id,
      Name: borrowing.Name,
      equipment: borrowing.equipment,
      quantity: borrowing.quantity,
      date: borrowing.borrowDate.toISOString().split('T')[0],
      status: borrowing.status
    });
  } catch (error) {
    console.error('Return item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete borrowing record
// @route   DELETE /api/v1/admin/borrowing/:id
// @access  Private/Admin
router.delete('/admin/borrowing/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const borrowing = await Borrowing.findById(req.params.id);
    
    if (!borrowing) {
      return res.status(404).json({ message: 'Borrowing record not found' });
    }
    
    // If item was out, update equipment stock
    if (borrowing.status === 'Out Now') {
      const equipmentItem = await Equipment.findOne({ name: borrowing.equipment });
      if (equipmentItem) {
        equipmentItem.onLoan -= borrowing.quantity;
        await equipmentItem.save();
      }
    }
    
    await Borrowing.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Borrowing record deleted successfully' });
  } catch (error) {
    console.error('Delete borrowing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;