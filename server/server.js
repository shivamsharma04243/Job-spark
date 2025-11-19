require('dotenv').config();
const express = require('express');
const app = express();

// configure CORS and cookie parser
const cors = require('cors');
const cookieParser = require('cookie-parser');
function applyMiddlewares(app) {
  const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  const allowlist = new Set([CLIENT_ORIGIN]);
  const corsOptions = {
    origin(origin, callback) {
      if (!origin || allowlist.has(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    optionsSuccessStatus: 204,
  };

  // CORS + parsers
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json());
}
// Apply middlewares
applyMiddlewares(app);


app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

try {
  const router = require('./src/routes/router');
  app.use('/api', router);
} catch (e) {
  // Log the error so you know why router failed to load during development
  console.error('Failed to load router:', e.message || e);
}

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
