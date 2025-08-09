const mongoose = require('mongoose');

const wbsTaskSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  weight: {
    type: Number,
    default: 0
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  remainingPercent: {
    type: Number,
    default: 100
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedDate: Date,
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  parentId: String,
  children: [this]
});

const blockSchema = new mongoose.Schema({
  name: String,
  customName: String,
  floors: [{
    number: Number,
    customName: String,
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started'
    },
    progress: {
      type: Number,
      default: 0
    }
  }]
});

const projectSchema = new mongoose.Schema({
  projectCode: {
    type: String,
    required: true,
    unique: true
  },
  contractNumber: String,
  projectName: {
    type: String,
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  supervisorName: {
    type: String,
    required: true
  },
  supervisorPhone: String,
  address: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  numberOfFloors: {
    type: Number,
    required: true
  },
  blocks: [blockSchema],
  numberOfTypes: Number,
  projectArea: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'paused', 'completed'],
    default: 'planning'
  },
  overallProgress: {
    type: Number,
    default: 0
  },
  wbs: {
    structure: mongoose.Schema.Types.Mixed,
    tasks: [wbsTaskSchema]
  },
  estimation: {
    materials: [{
      materialType: String,
      quantity: Number,
      unit: String,
      unitPrice: Number,
      totalPrice: Number
    }],
    operations: [{
      operationType: String,
      quantity: Number,
      unit: String,
      unitPrice: Number,
      totalPrice: Number
    }],
    totalCost: Number
  },
  assignedCrews: [{
    crew: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crew'
    },
    blocks: [String],
    floors: [Number]
  }]
}, {
  timestamps: true
});

projectSchema.methods.calculateProgressFromWBS = function() {
  if (!this.wbs || !this.wbs.tasks || this.wbs.tasks.length === 0) return 0;
  
  const totalWeight = this.wbs.tasks.reduce((sum, task) => sum + (task.weight || 0), 0);
  const completedWeight = this.wbs.tasks.reduce((sum, task) => {
    const taskProgress = task.progress || 0;
    const taskWeight = task.weight || 0;
    return sum + (taskWeight * taskProgress / 100);
  }, 0);
  
  return totalWeight > 0 ? (completedWeight / totalWeight) * 100 : 0;
};

module.exports = mongoose.model('Project', projectSchema);
