const Joi = require('joi');
const redis = require('../utils/redis');

// Order validation schema
const orderSchema = Joi.object({
  customerId: Joi.string().required(),
  amount: Joi.number().required(),
  date: Joi.date().required(),
  campaignId: Joi.string() // Add campaignId to link to a campaign
});

exports.ingestOrder = async (req, res) => {
  const { error, value } = orderSchema.validate(req.body);
  
  // If validation fails, return a 400 error with the validation message
  if (error) return res.status(400).json({ error: error.details[0].message });

  // Validate if the campaignId is provided and exists (optional, you can handle this based on your logic)
  if (value.campaignId) {
    // Optionally, you can verify if the campaignId exists in your database or not
    // const campaign = await Campaign.findById(value.campaignId);
    // if (!campaign) return res.status(400).json({ error: 'Invalid campaignId' });
  }

  // Push the order data to the Redis stream
  await redis.xadd('order_stream', '*', 'data', JSON.stringify(value));

  // Respond with a success message
  res.status(200).json({ status: 'queued' });
};
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};