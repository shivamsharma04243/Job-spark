require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

try {
  const router = require('./src/routes/router');
  app.use('/api', router);
} catch (e) {}

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});