const redis = require('../utils/redis');

async function startVendorConsumer() {
  console.log('Vendor Consumer started...');

  let lastId = '0'; // Start from the beginning

  while (true) {
    try {
      const response = await redis.xread(
        'BLOCK', 5000, // wait up to 5 seconds if no messages
        'COUNT', 10,
        'STREAMS', 'delivery_receipts', lastId
      );

      if (response) {
        const [stream, messages] = response[0];
        for (const [id, fields] of messages) {
          const data = JSON.parse(fields[1]);
          console.log('📦 Received delivery receipt:', data);

          // Simulate processing...
          lastId = id;
        }
      }
    } catch (err) {
      console.error('❌ Vendor consumer error:', err);
    }
  }
}

startVendorConsumer();
