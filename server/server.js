// server.clean.structured.js
// Clean, modular and defensive Express server bootstrap

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// App-level configuration object (single place to change values)
const config = {
  port: Number(process.env.PORT ) || 5000,
  env: process.env.NODE_ENV || 'development',
  clientOrigins: [
    process.env.CLIENT_ORIGIN,
    'http://localhost:3000',
    'http://localhost:5173'
  ].filter(Boolean),
  jsonLimit: '10mb'
};

// Create express app factory so this file can be tested/imported
function createApp() {
  const app = express();

  // --- Middlewares ---
  // CORS with dynamic origin validation
  app.use(cors({
    origin: (origin, callback) => {
      // allow non-browser requests like curl, mobile apps
      if (!origin) return callback(null, true);
      if (config.clientOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
  }));

  app.use(cookieParser());
  app.use(express.json({ limit: config.jsonLimit }));
  app.use(express.urlencoded({ extended: true }));

  // --- Health check ---
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      environment: config.env,
      timestamp: new Date().toISOString()
    });
  });

  // --- API routes: attempt to load and mount user router ---
  const routes = require('./src/routes/routes');
  app.use('/api', routes);

  // --- API 404 handler ---
  // Avoid using path patterns like '/api/*' which may break with certain path-to-regexp versions.
  // Instead detect requests whose path starts with '/api/' and return 404.
  app.use((req, res, next) => {
    if (req.path && req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'Endpoint not found', path: req.originalUrl });
    }
    return next();
  });

  // --- Static assets (optional) ---
  // Uncomment and update the build path if you serve a frontend from the same server
  // const clientBuildPath = path.join(__dirname, 'client', 'build');
  // app.use(express.static(clientBuildPath));

  // --- Error handling ---
  // This error handler should be last - it catches errors forwarded via next(err)
  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err && err.stack ? err.stack : err);

    if (err && err.message === 'Not allowed by CORS') {
      return res.status(403).json({ error: 'CORS policy violation', message: 'Origin not allowed' });
    }

    const payload = {
      error: 'Internal server error'
    };

    if (config.env === 'development' && err) {
      payload.details = err.message || String(err);
      payload.stack = err.stack;
    }

    res.status(err && err.status ? err.status : 500).json(payload);
  });

  return app;
}

// Start server only when run directly. Export app for tests.
if (require.main === module) {
  const app = createApp();
  const server = app.listen(config.port, () => {
    console.log('\n🚀 Server running successfully!');
    console.log(`📍 Port: ${config.port}`);
    console.log(`🌍 Environment: ${config.env}`);
    console.log(`📊 Health check: http://localhost:${config.port}/health\n`);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log('\n🛑 Received shutdown signal, closing server...');
    server.close(() => {
      console.log('✅ Server closed successfully');
      process.exit(0);
    });

    setTimeout(() => {
      console.log('⚠️ Forcing server closure');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

module.exports = { createApp, config };
