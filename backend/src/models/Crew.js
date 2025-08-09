const mongoose = require('mongoose');

const crewSchema = new mongoose.Schema({
  crewName: {
    type: String,
    required: true,
    unique: true
  },
  crewLeader: {
    type: String,
    required: true
  },
  contactNumber: String,
  specialization: {
    type: String,
    required: true
  },
  numberOfMembers: {
    type: Number,
    required: true
  },
  assignments: [{
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    },
    blocks: [String],
    floors: [Number],
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['assigned', 'working', 'completed'],
      default: 'assigned'
    }
  }],
  totalStatements: {
    type: Number,
    default: 0
  },
  totalPayments: {
    type: Number,
    default: 0
  },
  balance: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Crew', crewSchema);
