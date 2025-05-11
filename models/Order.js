// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  orderItems: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  amount: { type: Number, required: true },
  orderStatus: { type: String, enum: ['pending', 'completed', 'shipped', 'failed'], default: 'pending' },
  placedAt: { type: Date, default: Date.now },
  deliveryDate: { type: Date },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' } // Link to campaign if part of a promotion
});

module.exports = mongoose.model('Order', orderSchema);
