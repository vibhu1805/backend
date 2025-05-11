const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['email', 'sms'], required: true },
  messageTemplate: { type: String, required: true },
  audienceSize: { type: Number, required: true },
  segment: [
    {
      field: String,
      operator: String,
      value: mongoose.Schema.Types.Mixed,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Campaign', campaignSchema);
