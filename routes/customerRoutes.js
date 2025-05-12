/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management endpoints
 */

const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Ingest customer data
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer data queued successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, customerController.ingestCustomer);
/**
* @swagger
 * /api/customers:
 *   get:
 *     summary: Retrieve a list of customers
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   totalSpend:
 *                     type: number
 *                   visits:
 *                     type: number
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/', authMiddleware, customerController.getAllCustomers);


module.exports = router;
