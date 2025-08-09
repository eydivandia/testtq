const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activityType: {
    type: String,
    required: true,
    enum: ['login', 'logout', 'create', 'update', 'delete', 'view', 'approve', 'reject', 'payment']
  },
  module: {
    type: String,
    required: true
  },
  action: String,
  details: mongoose.Schema.Types.Mixed,
  browser: String,
  ipAddress: String,
  warnings: [String],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
