require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Middlewares
app.use(cors({
  origin: [
    process.env.CLIENT_ORIGIN,
    'http://localhost:3000', 
    'http://localhost:5173'
  ].filter(Boolean),
  credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;