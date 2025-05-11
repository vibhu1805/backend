require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const User = require('./models/User');

async function cleanUp() {
  try {
    // Connect using your MongoDB URI from environment variables
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/your_database_name');
    console.log('Connected to MongoDB');
    
    // Option 1: Remove googleId field from documents where it's null
    const updateResult = await User.updateMany(
      { googleId: null },
      { $unset: { googleId: "" } }
    );
    console.log(`Updated ${updateResult.modifiedCount} documents`);
    
    // Option 2: Or delete documents with null googleId (uncomment to use)
    // const deleteResult = await User.deleteMany({ googleId: null });
    // console.log(`Deleted ${deleteResult.deletedCount} documents`);
    
    // Rebuild indexes
    await User.syncIndexes();
    console.log('Indexes rebuilt successfully');
    
    process.exit(0);
  } catch (err) {
    console.error('Cleanup failed:', err);
    process.exit(1);
  }
}

cleanUp();