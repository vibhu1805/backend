const app = require('./app');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(5000, () => console.log('Server running on port 5000'));
});
