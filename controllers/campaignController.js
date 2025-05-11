const Campaign = require('../models/Campaign');
const Customer = require('../models/Customer');
const CommunicationLog = require('../models/CommunicationLog');
const axios = require('axios');
const Redis = require('ioredis');
const redis = new Redis();

exports.createCampaign = async (req, res) => {
  try {
    const { name, segment, messageTemplate } = req.body;

    if (!Array.isArray(segment) || segment.length === 0) {
      return res.status(400).json({ error: 'Segment must be a non-empty array of rules' });
    }

    // Convert segment rules to MongoDB query
    const mongoQuery = segment.reduce((query, rule) => {
      switch (rule.operator) {
        case '>':
          query[rule.field] = { ...query[rule.field], $gt: Number(rule.value) };
          break;
        case '<':
          query[rule.field] = { ...query[rule.field], $lt: Number(rule.value) };
          break;
        case '>=':
          query[rule.field] = { ...query[rule.field], $gte: Number(rule.value) };
          break;
        case '<=':
          query[rule.field] = { ...query[rule.field], $lte: Number(rule.value) };
          break;
        case '==':
          query[rule.field] = rule.value;
          break;
        case '!=':
          query[rule.field] = { $ne: rule.value };
          break;
        default:
          throw new Error(`Unsupported operator: ${rule.operator}`);
      }
      return query;
    }, {});

    const customers = await Customer.find(mongoQuery);

    // Create campaign in DB
    const campaign = await Campaign.create({
      name,
      segment,
      messageTemplate,
      type: 'sms',
      audienceSize: customers.length,
    });

    // Send messages and create logs
    for (const customer of customers) {
      const personalizedMessage = messageTemplate.replace('{{name}}', customer.name);

      const log = await CommunicationLog.create({
        campaignId: campaign._id,
        customerId: customer._id,
        message: personalizedMessage,
        status: 'PENDING',
      });

      const success = Math.random() < 0.9;
      const status = success ? 'SENT' : 'FAILED';

      // Simulate delivery receipt via dummy API
      await axios.post('http://localhost:5000/api/delivery-receipt', {
        logId: log._id,
        status,
      });

      // Push to Redis stream
      await redis.xadd('delivery_receipts', '*', 'logId', log._id.toString(), 'status', status);
    }

    res.status(201).json({ message: 'Campaign created and messages sent', campaign });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getCampaignHistory = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });

    const stats = await Promise.all(
      campaigns.map(async (camp) => {
        const logs = await CommunicationLog.find({ campaignId: camp._id });
        const sent = logs.filter(log => log.status === 'SENT').length;
        const failed = logs.filter(log => log.status === 'FAILED').length;

        return {
          _id: camp._id,
          name: camp.name,
          type: camp.type,
          audienceSize: camp.audienceSize,
          createdAt: camp.createdAt,
          sent,
          failed,
        };
      })
    );

    res.status(200).json(stats);
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ error: 'Failed to fetch campaign history' });
  }
};
