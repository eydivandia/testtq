const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  supplierName: {
    type: String,
    required: true
  },
  purchaseDate: {
    type: Date,
    required: true
  },
  materialType: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  unitPrice: Number,
  totalPrice: Number,
  assignedToWarehouse: {
    type: Boolean,
    default: false
  },
  currentStock: {
    type: Number,
    default: function() {
      return this.quantity;
    }
  },
  allocations: [{
    allocatedTo: {
      type: {
        type: String,
        enum: ['project', 'block', 'floor', 'section', 'crew']
      },
      project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
      },
      block: String,
      floor: Number,
      section: String,
      crew: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Crew'
      }
    },
    quantity: Number,
    allocationDate: {
      type: Date,
      default: Date.now
    },
    allocatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }],
  minimumStock: {
    type: Number,
    default: 0
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paymentDate: Date
}, {
  timestamps: true
});

materialSchema.methods.isLowStock = function() {
  return this.currentStock <= this.minimumStock;
};

module.exports = mongoose.model('Material', materialSchema);
