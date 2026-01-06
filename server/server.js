require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const schedule = require('node-schedule');
const { expireOldJobs } = require('./src/jobs/job-expiration-cleanup');

const app = express();

// Middlewares
// Configure CORS with a function to handle origins dynamically and prevent duplicates
const allowedOrigins = [
  'https://jobion.in',
  'https://www.jobion.in',
  'https://api.jobion.in',
  'http://localhost:3000',
  'http://localhost:5173',
  'https://accounts.google.com',
  'https://oauth2.googleapis.com',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      // Return the origin explicitly to prevent duplicates
      callback(null, origin);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Headers for Google Sign-In compatibility
// This middleware runs AFTER CORS to clean up headers that block Google Sign-In
app.use((req, res, next) => {
  // Store original methods
  const originalSetHeader = res.setHeader.bind(res);
  const originalEnd = res.end.bind(res);

  // Track if Access-Control-Allow-Origin has been set to prevent duplicates
  let corsOriginSet = false;

  // Intercept setHeader to prevent problematic headers and duplicates
  res.setHeader = function (name, value) {
    const lowerName = name.toLowerCase();

    // Block headers that interfere with Google Sign-In
    if (lowerName === 'cross-origin-opener-policy' || lowerName === 'cross-origin-embedder-policy') {
      return res; // Don't set these headers
    }

    // Prevent duplicate Access-Control-Allow-Origin headers
    if (lowerName === 'access-control-allow-origin') {
      if (corsOriginSet) {
        // Header already set, don't duplicate
        console.warn(`Duplicate Access-Control-Allow-Origin header detected. Ignoring: ${value}`);
        return res;
      }
      corsOriginSet = true;
    }

    return originalSetHeader(name, value);
  };

  // Clean up headers right before response ends
  res.end = function (chunk, encoding) {
    // Final cleanup before sending - remove problematic headers
    try {
      res.removeHeader('Cross-Origin-Opener-Policy');
      res.removeHeader('Cross-Origin-Embedder-Policy');

      // Ensure single Access-Control-Allow-Origin (handle array case)
      const existingOrigin = res.getHeader('access-control-allow-origin');
      if (existingOrigin) {
        if (Array.isArray(existingOrigin)) {
          // Multiple values detected - keep only the first one
          res.removeHeader('Access-Control-Allow-Origin');
          originalSetHeader('Access-Control-Allow-Origin', existingOrigin[0]);
        } else if (typeof existingOrigin === 'string' && existingOrigin.includes(',')) {
          // Comma-separated values detected - keep only the first one
          const firstOrigin = existingOrigin.split(',')[0].trim();
          res.removeHeader('Access-Control-Allow-Origin');
          originalSetHeader('Access-Control-Allow-Origin', firstOrigin);
        }
      }
    } catch (err) {
      // Ignore errors during cleanup
      console.error('Error cleaning up headers:', err.message);
    }

    return originalEnd(chunk, encoding);
  };

  // Add necessary headers for OAuth compatibility
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');

  next();
});

// Input validation middleware for SQL injection prevention
const { validateInput, validateJobFilters } = require('./src/middlewares/inputValidation');

// Skip input validation for Google OAuth endpoint
app.use((req, res, next) => {
  if (req.path === '/api/auth/google') {
    return next();
  }
  validateInput(req, res, next);
});

// Serve static files from uploads directory
const uploadsPath = path.join(__dirname, 'src', 'api', 'uploads');

// Middleware to handle PDF files with inline disposition
app.use('/uploads', (req, res, next) => {
  // Check if the request is for a PDF file
  if (req.path.toLowerCase().endsWith('.pdf')) {
    // Set headers to display PDF inline in browser
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
  }
  next();
});

app.use('/uploads', express.static(uploadsPath));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
const routes = require('./src/routes/routes');
app.use('/api', routes);

// API 404 handler
app.use((req, res) => {
  if (req.path?.startsWith('/api/')) {
    res.status(404).json({
      success: false,
      error: 'Endpoint not found'
    });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);

  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Schedule job expiration cleanup to run daily at 2 AM
schedule.scheduleJob('0 2 * * *', async () => {
  try {
    console.log('Scheduled job cleanup started...');
    await expireOldJobs();
  } catch (error) {
    console.error('Scheduled job cleanup failed:', error);
  }
});

// Also run cleanup on server start (for development/testing)
if (process.env.NODE_ENV !== 'production') {
  expireOldJobs().catch(console.error);
}

// Start server
const PORT = process.env.PORT || 5000;

// Test database connection on server start
const { testConnection } = require('./src/api/config/db');

(async () => {
  // Test database connection
  await testConnection();

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();

module.exports = app;