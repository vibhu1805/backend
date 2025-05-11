const mongoose = require('mongoose');
const redis = require('../utils/redis');
const Customer = require('../models/Customer');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vibhutisharma483:Asdfghjkl@cluster0.4kwouzt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function main() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    await processCustomer();
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

async function processCustomer() {
  const stream = 'customer_stream';
  let lastId = '0'; // Start reading from the first entry in the stream
  console.log('Customer consumer started...');

  while (true) {
    try {
      const res = await redis.xread('BLOCK', 0, 'COUNT', 1, 'STREAMS', stream, lastId);
      if (!res) continue;

      const [[, entries]] = res;
      console.log(`Received ${entries.length} entries from stream`);

      for (const [id, [, data]] of entries) {
        try {
          const parsed = JSON.parse(data);
          console.log('Processing customer:', parsed);

          try {
            // Attempt to create a new customer, MongoDB will handle duplicates
            const newCustomer = await Customer.create(parsed);
            console.log('Saved customer:', newCustomer);
          } catch (err) {
            if (err.code === 11000) {
              console.log(`Duplicate customer found: ${parsed.email}`);
            } else {
              console.error('Error processing entry:', err);
            }
          }

          // Update the last ID processed to avoid re-reading the same stream entry
          lastId = id;
        } catch (err) {
          console.error('Error processing entry:', err);
        }
      }
    } catch (err) {
      console.error('Error reading from stream:', err);
    }
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
