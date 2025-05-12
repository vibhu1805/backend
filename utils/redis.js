const Redis = require('ioredis');

// Create a Redis client instance using ioredis
const redis = new Redis({
 host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  tls: {}, // Enable this for secure connection (TLS)       // Specify the Redis port if different
  // Add authentication and other settings if required
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Error connecting to Redis:', err);
});

module.exports = redis;
