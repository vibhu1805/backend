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

// In customerController.js
exports.ingestCustomer = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    console.log('Received:', { name, email, phone });

    const payload = JSON.stringify({ name, email, phone });

    await redis.xadd('customer_stream', '*', 'data', payload);

    return res.status(200).json({ message: 'Customer data queued successfully' });
  } catch (err) {
    console.error('❌ Backend Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
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
