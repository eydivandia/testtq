const mongoose = require('mongoose');

const statementSchema = new mongoose.Schema({
  statementNumber: {
    type: String,
    required: true,
    unique: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  crew: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crew',
    required: true
  },
  previousStatement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Statement'
  },
  blocks: [{
    name: String,
    customName: String
  }],
  sections: [String],
  floor: {
    type: Number,
    required: true
  },
  workType: {
    type: String,
    required: true
  },
  workName: String,
  operationDescription: {
    type: String,
    required: true
  },
  operationVolume: {
    type: Number,
    required: true
  },
  unit: String,
  unitPrice: Number,
  totalAmount: {
    type: Number,
    required: true
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  submitterName: String,
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvalDate: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approverName: String,
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partial', 'paid'],
    default: 'unpaid'
  },
  payments: [{
    amount: Number,
    paymentDate: Date,
    paymentMethod: String,
    reference: String,
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  totalPaid: {
    type: Number,
    default: 0
  },
  remainingBalance: {
    type: Number,
    default: function() {
      return this.totalAmount;
    }
  },
  previousBalance: {
    type: Number,
    default: 0
  },
  cumulativeAmount: {
    type: Number,
    default: function() {
      return this.totalAmount + (this.previousBalance || 0);
    }
  }
}, {
  timestamps: true
});

statementSchema.pre('save', async function(next) {
  if (this.previousStatement) {
    const prevStatement = await this.constructor.findById(this.previousStatement);
    if (prevStatement) {
      this.previousBalance = prevStatement.remainingBalance || 0;
      this.cumulativeAmount = this.totalAmount + this.previousBalance;
    }
  }
  
  this.remainingBalance = this.totalAmount - this.totalPaid;
  next();
});

module.exports = mongoose.model('Statement', statementSchema);
