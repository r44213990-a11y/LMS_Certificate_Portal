const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Database connection
const connectDB = require('./config/database');

// Routes
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const resultRoutes = require('./routes/results');
const certificateRoutes = require('./routes/certificate');

// Sample data initialization
const initializeData = require('./config/initializeData');

const app = express();
const PORT = process.env.PORT || 5000;

// Validate required environment variables
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not set');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET environment variable is not set');
  process.exit(1);
}

console.log('✅ Environment variables validated');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
console.log('NODE_ENV:', process.env.NODE_ENV);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-app.vercel.app'] // Update with your Vercel domain
    : ['http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

// Add error logging middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Connect to MongoDB
connectDB();

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api', resultRoutes);
app.use('/api/certificate', certificateRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Initialize sample data asynchronously (non-blocking)
setTimeout(() => {
  initializeData().catch(err => {
    console.error('Failed to initialize data:', err.message);
  });
}, 2000); // Wait 2 seconds after server starts

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});