const mongoose = require('mongoose');
const redis = require('../utils/redis');
const Order = require('../models/Order'); // Make sure this path is correct

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vibhutisharma483:Asdfghjkl@cluster0.4kwouzt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB for orders');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
}

async function processOrders() {
  const stream = 'order_stream';
  let lastId = '0'; // Read from beginning; you can change to '$' to only read new entries

  console.log('📦 Order consumer started...');

  while (true) {
    try {
      const response = await redis.xread('BLOCK', 0, 'COUNT', 1, 'STREAMS', stream, lastId);

      if (!response) continue;

      const [[, entries]] = response;

      for (const [id, [, rawData]] of entries) {
        try {
          const orderData = JSON.parse(rawData);
          console.log('📥 Processing order:', orderData);

          await Order.create(orderData);
          console.log('✅ Order saved to MongoDB:', orderData);

          lastId = id; // Update to avoid reprocessing
        } catch (err) {
          console.error('❌ Error saving order:', err.message);
        }
      }
    } catch (err) {
      console.error('❌ Redis stream read error:', err.message);
    }
  }
}

async function main() {
  await connectToMongoDB();
  await processOrders();
}

main();
