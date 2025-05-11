// routes/audienceRoutes.js
const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

/**
 * @swagger
 * tags:
 *   name: Audience
 *   description: Audience segmentation and preview
 */

/**
 * @swagger
 * /api/audience/preview:
 *   post:
 *     summary: Preview audience size based on dynamic rules
 *     tags: [Audience]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     field:
 *                       type: string
 *                       example: spend
 *                     operator:
 *                       type: string
 *                       enum: [">", "<", ">=", "<=", "==", "!="]
 *                       example: ">"
 *                     value:
 *                       type: number
 *                       example: 10000
 *     responses:
 *       200:
 *         description: Audience size successfully calculated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 audienceSize:
 *                   type: number
 *                   example: 42
 *       500:
 *         description: Internal server error
 */
router.post('/preview', async (req, res) => {
  try {
    const { rules } = req.body;
    const query = {};

    for (const rule of rules) {
      const { field, operator, value } = rule;
      if (!query[field]) query[field] = {};
      query[field][`$${operatorMap(operator)}`] = Number(value);
    }

    const count = await Customer.countDocuments(query);
    res.json({ audienceSize: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const operatorMap = (op) => ({
  '>': 'gt',
  '<': 'lt',
  '>=': 'gte',
  '<=': 'lte',
  '==': 'eq',
  '!=': 'ne',
}[op]);

module.exports = router;
