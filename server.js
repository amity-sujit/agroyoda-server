// server.js

require('dotenv').config();
const express = require('express');
const { connectDB, closeDB } = require('./config/db');
const featureRoutes = require('./routes/featureRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
console.log('Port fetched :- '+process.env.PORT);
app.use(express.json());
// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
      ? 'https://prudencier.com' // Production frontend domain
      : 'http://localhost:3000', // dev server
    methods: ['GET', 'POST'], // Restrict to needed methods
    credentials: true, // Allow cookies/headers if needed (optional)
  };
  app.use(cors());
  
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/features', featureRoutes);

// Start the server
async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  await closeDB();
  process.exit(0);
});

startServer();