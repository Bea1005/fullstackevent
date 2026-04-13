require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const borrowingRoutes = require('./src/routes/borrowingRoutes');
const equipmentRoutes = require('./src/routes/equipmentRoutes');
const screenerRoutes = require('./src/routes/screenerRoutes'); // ✅ ADDED
const coachRoutes = require('./src/routes/coachRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// CORS Configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes Configuration
const PORT = process.env.PORT || 4000;
const BASE_URI = process.env.BASE_URI || '/api/v1';

// Register Routes
app.use(BASE_URI, authRoutes);
app.use(BASE_URI, adminRoutes);
app.use(BASE_URI, borrowingRoutes);
app.use(BASE_URI, equipmentRoutes);
app.use(BASE_URI, screenerRoutes); // ✅ ADDED
app.use(BASE_URI, coachRoutes); // ✅ Coach portal routes

// Health Check Endpoint
app.get(`${BASE_URI}/health`, (req, res) => {
  res.json({ status: 'OK', message: 'Server is running', timestamp: new Date() });
});

// JSON Parsing Error Handler (must come before other error handlers)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('JSON parsing error:', err.message);
    return res.status(400).json({ 
      message: 'Invalid JSON in request body',
      error: err.message 
    });
  }
  next(err);
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: err.message 
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Base URI: http://localhost:${PORT}${BASE_URI}`);
});