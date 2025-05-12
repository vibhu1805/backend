const express = require('express');
const session = require('express-session');
const passport = require('passport');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
require('dotenv').config();
require('./config/passport');

const app = express();
const cors = require('cors');
app.use(cors({ origin: 'https://mini-crm-frontend-tw6z.vercel.app/', credentials: true }));
// Middlewares
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',  // Using environment variable for security
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }  // Secure cookies in production
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/auth', require('./routes/authRoutes'));  // Google OAuth routes
app.use('/api/delivery-receipt', require('./routes/deliveryRoutes'));
app.use('/api/dashboard'  , require('./routes/dashboardRoutes'));
// Swagger Documentation Route
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use('/api/campaigns', require('./routes/campaignRoutes'));
app.use('/api/audience', require('./routes/audienceRoutes'));
app.use('/api/campaigns', require('./routes/campaignRoutes'));

// Start the Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
