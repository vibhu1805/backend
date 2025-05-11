const session = require('express-session');
require('dotenv').config();  // Make sure to load environment variables

app.use(session({
  secret: process.env.SESSION_SECRET,  // Load session secret from .env
  resave: false,                      // Do not resave session if not modified
  saveUninitialized: true,            // Save session even if it’s not initialized
  cookie: {
    secure: process.env.NODE_ENV === 'production',  // Secure cookies in production (requires HTTPS)
    httpOnly: true,                    // Prevent client-side JavaScript access to the session cookie
    maxAge: 24 * 60 * 60 * 1000       // Cookie expires in 1 day (adjust as needed)
  }
}));
