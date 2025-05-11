const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/campaigns:
 *   post:
 *     summary: Create a campaign and trigger delivery
 *     tags: [Campaigns]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               segment:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     field:
 *                       type: string
 *                     operator:
 *                       type: string
 *                     value:
 *                       type: string
 *               messageTemplate:
 *                 type: string
 *     responses:
 *       201:
 *         description: Campaign created
 */
router.post('/', auth, campaignController.createCampaign);


/**
 * @swagger
 * /api/campaigns/history:
 *   get:
 *     summary: Get all past campaigns with delivery stats
 *     tags:
 *       - Campaigns
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of past campaigns with delivery statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   type:
 *                     type: string
 *                   audienceSize:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   sent:
 *                     type: integer
 *                   failed:
 *                     type: integer
 *       500:
 *         description: Failed to fetch campaign history
 */
router.get('/history', auth, campaignController.getCampaignHistory);

module.exports = router;


