const mongoose = require('mongoose');
const Redis = require('ioredis');
const CommunicationLog = require('../models/CommunicationLog');
const redis = new Redis();  // Redis client
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/xeno-crm');

// Batch size for processing
const BATCH_SIZE = 10;
const CONSUMER_GROUP = 'delivery_consumer_group';
const STREAM_NAME = 'delivery_receipts';

// Ensure the consumer group is created
const createConsumerGroup = async () => {
  try {
    await redis.xgroup('CREATE', STREAM_NAME, CONSUMER_GROUP, '$', 'MKSTREAM');
    console.log(`Consumer group '${CONSUMER_GROUP}' created for stream '${STREAM_NAME}'`);
  } catch (err) {
    if (err.message.includes('BUSYGROUP Consumer Group name already exists')) {
      console.log(`Consumer group '${CONSUMER_GROUP}' already exists`);
    } else {
      console.error('Error creating consumer group:', err);
    }
  }
};

createConsumerGroup(); // Create the group at the start

// Function to process delivery receipts in batches
async function consumeDeliveryReceipts() {
  while (true) {
    try {
      // Read a batch of messages from the Redis stream
      const entries = await redis.xreadgroup('GROUP', CONSUMER_GROUP, 'consumer1', 'BLOCK', 0, 'COUNT', BATCH_SIZE, 'STREAMS', STREAM_NAME, '>');

      // If there are entries, process them
      if (entries) {
        for (const [, messages] of entries) {
          const batchUpdates = [];

          // Process each message in the batch
          for (const [id, data] of messages) {
            const logId = data[1]; // Extract log ID
            const status = data[3]; // Extract status (SENT or FAILED)

            // Prepare update for the communication log
            const update = CommunicationLog.findByIdAndUpdate(logId, {
              status,
              deliveryTime: new Date(),
            });

            batchUpdates.push(update);
          }

          // Perform batch update in MongoDB
          await Promise.all(batchUpdates);

          // Acknowledge the messages after processing them
          const messageIds = messages.map(([id]) => id);
          await redis.xack(STREAM_NAME, CONSUMER_GROUP, ...messageIds);

          console.log(`Batch of ${messageIds.length} messages processed`);
        }
      }
    } catch (err) {
      console.error('Error consuming delivery receipts:', err);
    }
  }
}

// Start consuming delivery receipts
consumeDeliveryReceipts();
