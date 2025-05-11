// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Campaign = require('../models/Campaign');

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard metrics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard metrics
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const totalOrders = await Order.countDocuments();
    const recentCampaigns = await Campaign.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalCustomers,
      totalOrders,
      recentCampaigns,
    });
  } catch (error) {
    res.status(500).json({ message: 'Dashboard data fetch failed', error });
  }
});

module.exports = router;
