require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const borrowingRoutes = require('./src/routes/borrowingRoutes');
const equipmentRoutes = require('./src/routes/equipmentRoutes');
const screenerRoutes = require('./src/routes/screenerRoutes');
const coachRoutes = require('./src/routes/coachRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// CORS — allow localhost in dev and the deployed frontend in production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL, // set this in production (e.g. https://your-app.vercel.app)
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4000;
const BASE_URI = process.env.BASE_URI || '/api/v1';

// Routes
app.use(BASE_URI, authRoutes);
app.use(BASE_URI, adminRoutes);
app.use(BASE_URI, borrowingRoutes);
app.use(BASE_URI, equipmentRoutes);
app.use(BASE_URI, screenerRoutes);
app.use(BASE_URI, coachRoutes);

// Root redirect
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'GymStat API — visit /api/v1 for endpoints' });
});

// Base URI & Health Check
app.get(BASE_URI, (req, res) => {
  res.json({ status: 'OK', message: 'API is running', timestamp: new Date() });
});

app.get(`${BASE_URI}/health`, (req, res) => {
  res.json({ status: 'OK', message: 'Server is running', timestamp: new Date() });
});

// JSON Parse Error Handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON in request body' });
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
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Base URI: http://localhost:${PORT}${BASE_URI}`);
});
