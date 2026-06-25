require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const sareeRoutes = require('./routes/sarees');
const orderRoutes = require('./routes/orders');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/sarees', sareeRoutes);
app.use('/api/orders', orderRoutes);

// Serve the frontend
app.use(express.static(path.join(__dirname, 'public')));

// Any non-API route falls back to the single-page app
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'Not found.' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;

if (!process.env.MONGODB_URI) {
  console.error('Missing MONGODB_URI. Add it to your .env file (locally) or Render environment variables (in production).');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`RubaShree Silks server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1);
  });
