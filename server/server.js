// Load environment variables from .env into process.env
require('dotenv').config();
const express = require('express');
const app = express();

// CORS and cookie parsing dependencies
const cors = require('cors');
const cookieParser = require('cookie-parser');

function applyMiddlewares(app) {
  
  const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

  // Use a Set for O(1) lookups (makes it easy to add more allowed origins later)
  const allowlist = new Set([CLIENT_ORIGIN]);

  // CORS options object passed to cors()
  const corsOptions = {
    // origin is a function so we can dynamically allow certain origins
    origin(origin, callback) {
      // If origin is falsy (e.g., same-origin requests or tools like curl) allow it.
      // Otherwise only allow origins explicitly in the allowlist.
      if (!origin || allowlist.has(origin)) return callback(null, true);
      // Reject others — the error will surface as CORS failure in the browser.
      return callback(new Error('Not allowed by CORS'));
    },

    // Allow cookies to be included in cross-origin requests (frontend must use fetch/axios with credentials)
    credentials: true,

    // Allowed HTTP methods for CORS preflight
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    // Allowed headers for cross-origin requests
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],

    // Status to return for successful OPTIONS requests in some legacy browsers
    optionsSuccessStatus: 204,
  };

  // Attach configured middleware to the express app
  app.use(cors(corsOptions));   // handle CORS
  app.use(cookieParser());      // parse cookies (populates req.cookies)
  app.use(express.json());      // parse JSON request bodies (populates req.body)
}

// Install middleware
applyMiddlewares(app);

// Health-check endpoint for load balancers / uptime checks
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

/**
 * Mount application routes.
 * The router is required inside a try/catch so the server can still start
 * even if router fails to load during development (helps debugging).
 *
 * In production you may want to fail fast instead of continuing to listen.
 */
try {
  const router = require("./src/routes/router");
  app.use('/api', router);
} catch (e) {
  // Helpful development log — includes the error message so you know why require failed
  console.error('Failed to load router:', e.message || e);
}

// Listen on the configured port
const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
