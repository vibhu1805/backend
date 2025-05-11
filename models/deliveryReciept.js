// models/Delivery.js
const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  status: { type: String, enum: ['sent', 'failed'], required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Delivery', deliverySchema);
