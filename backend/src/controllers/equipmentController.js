const Equipment = require('../models/Equipment');

// @desc    Get all equipment with pagination, filtering, and sorting
// @route   GET /api/v1/admin/equipment
// @access  Private/Admin
const getEquipment = async (req, res) => {
  try {
    // Get query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const condition = req.query.condition || '';
    const status = req.query.status || '';
    const minStock = req.query.minStock ? parseInt(req.query.minStock) : null;
    const maxStock = req.query.maxStock ? parseInt(req.query.maxStock) : null;
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    // Build filter object
    let filter = {};
    
    // Add search filter (search by name)
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    
    // Add category filter
    if (category) {
      filter.category = category;
    }
    
    // Add condition filter
    if (condition) {
      filter.condition = condition;
    }
    
    // Add status filter
    if (status) {
      filter.status = status;
    }
    
    // Add stock range filter
    if (minStock !== null || maxStock !== null) {
      filter.totalStock = {};
      if (minStock !== null) filter.totalStock.$gte = minStock;
      if (maxStock !== null) filter.totalStock.$lte = maxStock;
    }
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    // Get total count for pagination info
    const total = await Equipment.countDocuments(filter);
    
    // Get equipment with pagination, sorting, and filtering
    const equipment = await Equipment.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);
    
    // Calculate summary statistics
    const summary = await Equipment.aggregate([
      { $match: filter },
      { $group: {
        _id: null,
        totalItems: { $sum: '$totalStock' },
        totalAvailable: { $sum: '$available' },
        totalOnLoan: { $sum: '$onLoan' },
        lowStockCount: { $sum: { $cond: [{ $and: [{ $lt: ['$available', 5] }, { $gt: ['$available', 0] }] }, 1, 0] } },
        outOfStockCount: { $sum: { $cond: [{ $eq: ['$status', 'Out of Stock'] }, 1, 0] } }
      }}
    ]);
    
    res.json({
      success: true,
      data: equipment.map(item => ({
        id: item._id,
        name: item.name,
        category: item.category,
        total: item.totalStock,
        available: item.available,
        onLoan: item.onLoan,
        condition: item.condition,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      })),
      summary: summary[0] || {
        totalItems: 0,
        totalAvailable: 0,
        totalOnLoan: 0,
        lowStockCount: 0,
        outOfStockCount: 0
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      },
      filters: {
        search: search || null,
        category: category || null,
        condition: condition || null,
        status: status || null,
        minStock: minStock,
        maxStock: maxStock,
        sortBy: sortBy,
        sortOrder: sortOrder === 1 ? 'asc' : 'desc'
      }
    });
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single equipment by ID
// @route   GET /api/v1/admin/equipment/:id
// @access  Private/Admin
const getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    
    res.json({
      id: equipment._id,
      name: equipment.name,
      category: equipment.category,
      totalStock: equipment.totalStock,
      onLoan: equipment.onLoan,
      available: equipment.available,
      condition: equipment.condition,
      status: equipment.status,
      createdAt: equipment.createdAt,
      updatedAt: equipment.updatedAt
    });
  } catch (error) {
    console.error('Get equipment by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new equipment
// @route   POST /api/v1/admin/equipment
// @access  Private/Admin
const createEquipment = async (req, res) => {
  try {
    const { name, category, total, condition } = req.body;
    
    // Validate required fields
    if (!name || !total) {
      return res.status(400).json({ message: 'Name and total stock are required' });
    }
    
    if (total < 0) {
      return res.status(400).json({ message: 'Total stock cannot be negative' });
    }
    
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
      success: true,
      message: 'Equipment added successfully',
      data: {
        id: equipment._id,
        name: equipment.name,
        category: equipment.category,
        total: equipment.totalStock,
        available: equipment.available,
        condition: equipment.condition,
        status: equipment.status
      }
    });
  } catch (error) {
    console.error('Create equipment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update equipment
// @route   PUT /api/v1/admin/equipment/:id
// @access  Private/Admin
const updateEquipment = async (req, res) => {
  try {
    const { name, category, totalStock, condition } = req.body;
    const equipment = await Equipment.findById(req.params.id);
    
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    
    // Check if new name already exists (excluding current equipment)
    if (name && name !== equipment.name) {
      const existingEquipment = await Equipment.findOne({ name });
      if (existingEquipment) {
        return res.status(400).json({ message: 'Equipment name already exists' });
      }
      equipment.name = name;
    }
    
    if (category) equipment.category = category;
    if (totalStock !== undefined) {
      if (totalStock < 0) {
        return res.status(400).json({ message: 'Total stock cannot be negative' });
      }
      equipment.totalStock = parseInt(totalStock);
    }
    if (condition) equipment.condition = condition;
    
    await equipment.save();
    
    res.json({
      success: true,
      message: 'Equipment updated successfully',
      data: {
        id: equipment._id,
        name: equipment.name,
        category: equipment.category,
        total: equipment.totalStock,
        available: equipment.available,
        condition: equipment.condition,
        status: equipment.status
      }
    });
  } catch (error) {
    console.error('Update equipment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete equipment
// @route   DELETE /api/v1/admin/equipment/:id
// @access  Private/Admin
const deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    
    // Check if equipment is currently on loan
    if (equipment.onLoan > 0) {
      return res.status(400).json({ 
        message: `Cannot delete equipment. ${equipment.onLoan} items are currently on loan. Please return them first.` 
      });
    }
    
    await Equipment.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Equipment deleted successfully'
    });
  } catch (error) {
    console.error('Delete equipment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update equipment stock (for borrowing/return)
// @route   PUT /api/v1/admin/equipment/:id/stock
// @access  Private/Admin
const updateEquipmentStock = async (req, res) => {
  try {
    const { onLoan } = req.body;
    const equipment = await Equipment.findById(req.params.id);
    
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    
    if (onLoan < 0 || onLoan > equipment.totalStock) {
      return res.status(400).json({ message: 'Invalid loan quantity' });
    }
    
    equipment.onLoan = onLoan;
    await equipment.save();
    
    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: {
        id: equipment._id,
        name: equipment.name,
        total: equipment.totalStock,
        available: equipment.available,
        onLoan: equipment.onLoan,
        status: equipment.status
      }
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get equipment by category (for dropdown filters)
// @route   GET /api/v1/admin/equipment/categories
// @access  Private/Admin
const getEquipmentCategories = async (req, res) => {
  try {
    const categories = await Equipment.distinct('category');
    const conditions = await Equipment.distinct('condition');
    const statuses = await Equipment.distinct('status');
    
    res.json({
      success: true,
      categories,
      conditions,
      statuses
    });
  } catch (error) {
    console.error('Get filter options error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get low stock equipment (available < 5 and > 0)
// @route   GET /api/v1/admin/equipment/low-stock
// @access  Private/Admin
const getLowStockEquipment = async (req, res) => {
  try {
    const lowStockItems = await Equipment.find({ 
      available: { $lt: 5, $gt: 0 } 
    }).sort({ available: 1 });
    
    res.json({
      success: true,
      data: lowStockItems.map(item => ({
        id: item._id,
        name: item.name,
        category: item.category,
        total: item.totalStock,
        available: item.available,
        condition: item.condition
      }))
    });
  } catch (error) {
    console.error('Get low stock error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get out of stock equipment
// @route   GET /api/v1/admin/equipment/out-of-stock
// @access  Private/Admin
const getOutOfStockEquipment = async (req, res) => {
  try {
    const outOfStock = await Equipment.find({ status: 'Out of Stock' })
      .sort({ name: 1 });
    
    res.json({
      success: true,
      data: outOfStock.map(item => ({
        id: item._id,
        name: item.name,
        category: item.category,
        total: item.totalStock,
        available: item.available,
        condition: item.condition
      }))
    });
  } catch (error) {
    console.error('Get out of stock error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get equipment statistics
// @route   GET /api/v1/admin/equipment/stats
// @access  Private/Admin
const getEquipmentStats = async (req, res) => {
  try {
    const totalEquipment = await Equipment.countDocuments();
    const totalItems = await Equipment.aggregate([
      { $group: { _id: null, total: { $sum: '$totalStock' } } }
    ]);
    const totalAvailable = await Equipment.aggregate([
      { $group: { _id: null, total: { $sum: '$available' } } }
    ]);
    const totalOnLoan = await Equipment.aggregate([
      { $group: { _id: null, total: { $sum: '$onLoan' } } }
    ]);
    
    const categoryBreakdown = await Equipment.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalStock: { $sum: '$totalStock' } } }
    ]);
    
    res.json({
      success: true,
      stats: {
        totalEquipmentTypes: totalEquipment,
        totalItems: totalItems[0]?.total || 0,
        totalAvailable: totalAvailable[0]?.total || 0,
        totalOnLoan: totalOnLoan[0]?.total || 0,
        categoryBreakdown
      }
    });
  } catch (error) {
    console.error('Get equipment stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  updateEquipmentStock,
  getEquipmentCategories,
  getLowStockEquipment,
  getOutOfStockEquipment,
  getEquipmentStats
};