const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all equipment
// @route   GET /api/v1/admin/equipment
// @access  Private/Admin
router.get('/admin/equipment', protect, authorize('admin'), async (req, res) => {
  try {
    const equipment = await Equipment.find().sort({ name: 1 });
    
    res.json(equipment.map(item => ({
      id: item._id,
      name: item.name,
      category: item.category,
      total: item.totalStock,
      available: item.available,
      condition: item.condition,
      status: item.status
    })));
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Add new equipment
// @route   POST /api/v1/admin/equipment
// @access  Private/Admin
router.post('/admin/equipment', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, category, total, condition } = req.body;
    
    // Check if equipment already exists
    const existingEquipment = await Equipment.findOne({ name });
    if (existingEquipment) {
      return res.status(400).json({ message: 'Equipment already exists' });
    }
    
    const equipment = await Equipment.create({
      name,
      category: category || 'General',
      totalStock: parseInt(total),
      onLoan: 0,
      condition: condition || 'Good'
    });
    
    res.status(201).json({
      id: equipment._id,
      name: equipment.name,
      category: equipment.category,
      total: equipment.totalStock,
      available: equipment.available,
      condition: equipment.condition
    });
  } catch (error) {
    console.error('Add equipment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update equipment
// @route   PUT /api/v1/admin/equipment/:id
// @access  Private/Admin
router.put('/admin/equipment/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, category, totalStock, condition } = req.body;
    const equipment = await Equipment.findById(req.params.id);
    
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    
    if (name) equipment.name = name;
    if (category) equipment.category = category;
    if (totalStock !== undefined) equipment.totalStock = parseInt(totalStock);
    if (condition) equipment.condition = condition;
    
    await equipment.save();
    
    res.json({
      id: equipment._id,
      name: equipment.name,
      category: equipment.category,
      total: equipment.totalStock,
      available: equipment.available,
      condition: equipment.condition
    });
  } catch (error) {
    console.error('Update equipment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete equipment
// @route   DELETE /api/v1/admin/equipment/:id
// @access  Private/Admin
router.delete('/admin/equipment/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);
    
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    
    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error('Delete equipment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update equipment stock (for borrowing)
// @route   PUT /api/v1/admin/equipment/:id/stock
// @access  Private/Admin
router.put('/admin/equipment/:id/stock', protect, authorize('admin'), async (req, res) => {
  try {
    const { onLoan } = req.body;
    const equipment = await Equipment.findById(req.params.id);
    
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    
    equipment.onLoan = onLoan;
    await equipment.save();
    
    res.json({
      id: equipment._id,
      name: equipment.name,
      total: equipment.totalStock,
      available: equipment.available,
      onLoan: equipment.onLoan
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;