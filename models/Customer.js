// models/Customer.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastPurchaseDate: { type: Date },
  totalSpend: { type: Number, default: 0 },
  totalVisits: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  campaigns: [{
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    status: { type: String, enum: ['sent', 'failed'], default: 'sent' },
    response: { type: String, enum: ['opened', 'clicked', 'ignored'], default: 'ignored' },
    timestamp: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Customer', customerSchema);
