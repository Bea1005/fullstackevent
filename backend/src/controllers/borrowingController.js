const Borrowing = require('../models/Borrowing');
const Equipment = require('../models/Equipment');

// @desc    Get all borrowing records
// @route   GET /api/v1/admin/borrowing
// @access  Private/Admin
const getBorrowingRecords = async (req, res) => {
  try {
    const borrowings = await Borrowing.find()
      .populate('borrowedBy', 'fullname email')
      .sort({ borrowDate: -1 });
    
    res.json(borrowings.map(b => ({
      id: b._id,
      Name: b.Name,
      equipment: b.equipment,
      quantity: b.quantity,
      date: b.borrowDate ? b.borrowDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      status: b.status,
      borrowedBy: b.borrowedBy,
      returnDate: b.returnDate,
      returnedAt: b.returnedAt
    })));
  } catch (error) {
    console.error('Get borrowing records error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new borrowing transaction
// @route   POST /api/v1/admin/borrowing
// @access  Private/Admin
const createBorrowing = async (req, res) => {
  try {
    const { Name, equipment, quantity } = req.body;
    
    // Validate required fields
    if (!Name || !equipment || quantity == null) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }
    
    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
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
    } else {
      return res.status(404).json({ message: `Equipment "${equipment}" not found in inventory` });
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
      status: borrowing.status,
      message: 'Borrowing transaction created successfully'
    });
  } catch (error) {
    console.error('Create borrowing error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Return item (update status to Completed)
// @route   PUT /api/v1/admin/borrowing/:id/return
// @access  Private/Admin
const returnBorrowedItem = async (req, res) => {
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
      status: borrowing.status,
      returnedAt: borrowing.returnedAt,
      message: 'Item returned successfully'
    });
  } catch (error) {
    console.error('Return item error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete borrowing record
// @route   DELETE /api/v1/admin/borrowing/:id
// @access  Private/Admin
const deleteBorrowingRecord = async (req, res) => {
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get borrowing record by ID
// @route   GET /api/v1/admin/borrowing/:id
// @access  Private/Admin
const getBorrowingById = async (req, res) => {
  try {
    const borrowing = await Borrowing.findById(req.params.id)
      .populate('borrowedBy', 'fullname email');
    
    if (!borrowing) {
      return res.status(404).json({ message: 'Borrowing record not found' });
    }
    
    res.json({
      id: borrowing._id,
      Name: borrowing.Name,
      equipment: borrowing.equipment,
      quantity: borrowing.quantity,
      borrowDate: borrowing.borrowDate,
      returnDate: borrowing.returnDate,
      status: borrowing.status,
      returnedAt: borrowing.returnedAt,
      borrowedBy: borrowing.borrowedBy
    });
  } catch (error) {
    console.error('Get borrowing by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update borrowing record
// @route   PUT /api/v1/admin/borrowing/:id
// @access  Private/Admin
const updateBorrowingRecord = async (req, res) => {
  try {
    const { Name, equipment, quantity, status } = req.body;
    const borrowing = await Borrowing.findById(req.params.id);
    
    if (!borrowing) {
      return res.status(404).json({ message: 'Borrowing record not found' });
    }
    
    // Handle equipment change
    if (equipment && equipment !== borrowing.equipment) {
      // Return stock to old equipment
      const oldEquipment = await Equipment.findOne({ name: borrowing.equipment });
      if (oldEquipment && borrowing.status === 'Out Now') {
        oldEquipment.onLoan -= borrowing.quantity;
        await oldEquipment.save();
      }
      
      // Borrow from new equipment
      const newEquipment = await Equipment.findOne({ name: equipment });
      if (newEquipment && status === 'Out Now') {
        if (newEquipment.available < quantity) {
          return res.status(400).json({ message: 'Insufficient stock for new equipment' });
        }
        newEquipment.onLoan += quantity;
        await newEquipment.save();
      }
      
      borrowing.equipment = equipment;
    }
    
    // Update fields
    if (Name) borrowing.Name = Name;
    if (quantity) borrowing.quantity = quantity;
    if (status) borrowing.status = status;
    
    await borrowing.save();
    
    res.json({
      id: borrowing._id,
      Name: borrowing.Name,
      equipment: borrowing.equipment,
      quantity: borrowing.quantity,
      status: borrowing.status,
      message: 'Borrowing record updated successfully'
    });
  } catch (error) {
    console.error('Update borrowing error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get borrowing statistics
// @route   GET /api/v1/admin/borrowing/stats
// @access  Private/Admin
const getBorrowingStats = async (req, res) => {
  try {
    const totalBorrowings = await Borrowing.countDocuments();
    const activeBorrowings = await Borrowing.countDocuments({ status: 'Out Now' });
    const completedBorrowings = await Borrowing.countDocuments({ status: 'Completed' });
    const overdueBorrowings = await Borrowing.countDocuments({ status: 'Overdue' });
    
    const mostBorrowedEquipment = await Borrowing.aggregate([
      { $group: { _id: '$equipment', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    res.json({
      totalBorrowings,
      activeBorrowings,
      completedBorrowings,
      overdueBorrowings,
      mostBorrowedEquipment
    });
  } catch (error) {
    console.error('Get borrowing stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getBorrowingRecords,
  createBorrowing,
  returnBorrowedItem,
  deleteBorrowingRecord,
  getBorrowingById,
  updateBorrowingRecord,
  getBorrowingStats
};