const mongoose = require('mongoose');

const BorrowingSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    trim: true
  },
  equipment: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  borrowDate: {
    type: Date,
    default: Date.now
  },
  returnDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['Out Now', 'Completed', 'Overdue'],
    default: 'Out Now'
  },
  returnedAt: {
    type: Date,
    default: null
  },
  borrowedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Format date for display
BorrowingSchema.virtual('formattedDate').get(function() {
  return this.borrowDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
});

module.exports = mongoose.model('Borrowing', BorrowingSchema);