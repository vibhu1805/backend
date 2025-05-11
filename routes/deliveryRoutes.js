const express = require('express');
const router = express.Router();
const CommunicationLog = require('../models/CommunicationLog');

/**
 * @swagger
 * /api/delivery-receipt:
 *   post:
 *     summary: Receive delivery status update from vendor
 *     tags:
 *       - Campaigns
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - logId
 *               - status
 *             properties:
 *               logId:
 *                 type: string
 *                 description: ID of the communication log
 *               status:
 *                 type: string
 *                 enum: [SENT, FAILED]
 *                 description: Delivery status from vendor
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       404:
 *         description: Log not found
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req, res) => {
  const { logId, status } = req.body;

  try {
    // Find the CommunicationLog and update status
    const log = await CommunicationLog.findById(logId);
    if (!log) return res.status(404).json({ error: 'Communication log not found' });

    log.status = status;
    log.deliveryTime = new Date();
    await log.save();

    res.status(200).json({ message: 'Delivery status updated successfully' });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
