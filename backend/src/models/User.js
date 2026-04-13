const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'coach', 'admin', 'screener'], 
    default: 'student'
  },
  department: {
    type: String,
    default: ''
  },
  sport: {
    type: String,
    default: ''
  },
  studentId: {
    type: String,
    default: ''
  },
  sportParticipation: {
    type: [
      {
        role: { type: String, default: '' },
        level: { type: String, default: '' },
        years: { type: String, default: '' }
      }
    ],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);