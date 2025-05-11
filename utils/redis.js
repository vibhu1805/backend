const Redis = require('ioredis');

// Create a Redis client instance using ioredis
const redis = new Redis({
  host: 'localhost',   // Specify the Redis host if not localhost
  port: 6379,          // Specify the Redis port if different
  // Add authentication and other settings if required
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Error connecting to Redis:', err);
});

module.exports = redis;
