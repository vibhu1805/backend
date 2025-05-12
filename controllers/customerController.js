const Joi = require('joi');
const redis = require('../utils/redis');
const Customer = require('../models/Customer');  // Import the Customer model

// Define customer schema with additional phone validation
const customerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address'
  }),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': 'Phone number must be exactly 10 digits'
  }),
  totalSpend: Joi.number(),
  visits: Joi.number(),
  inactiveDays: Joi.number()
});

exports.ingestCustomer = async (req, res) => {
  const { error, value } = customerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // Check if user is authenticated
  const user = req.user; // This comes from the JWT validation middleware
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  try {
  await host.xadd('customer_stream', '*', 'data', JSON.stringify(value));
  res.status(200).json({ status: 'queued' });
} catch (err) {
  console.error('Redis xadd error:', err); // <-- Add this
  res.status(500).json({ error: 'Error adding customer to stream', details: err.message });
}

};

// Fetch all customers from the database
exports.getAllCustomers = async (req, res) => {
  try {
    // Fetch customers from the database
    const customers = await Customer.find();
    
    if (customers.length === 0) {
      return res.status(404).json({ error: 'No customers found' });
    }

    // Return the list of customers
    res.status(200).json(customers);
  } catch (err) {
    console.error('Error fetching customers from DB:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};
