/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Ingest order data
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - amount
 *               - date
 *             properties:
 *               customerId:
 *                 type: string
 *                 example: "cus_123"
 *               amount:
 *                 type: number
 *                 example: 149.99
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-10"
 *     responses:
 *       200:
 *         description: Order data queued successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, orderController.ingestOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   orderId:
 *                     type: string
 *                     example: "ord_123"
 *                   customerId:
 *                     type: string
 *                     example: "cus_123"
 *                   amount:
 *                     type: number
 *                     example: 149.99
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2025-05-10"
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, orderController.getAllOrders);

module.exports = router;
