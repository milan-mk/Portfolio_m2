import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import messageRoutes from './routes/messageRoutes.js';

export const app = express();

// Allowed Origins for CORS
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev to avoid blocking portfolio visitors
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbState = mongoose.connection.readyState;

  res.status(200).json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    database: {
      status: dbStateMap[dbState] || 'unknown',
      connected: dbState === 1,
    },
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/messages', messageRoutes);
app.use('/api/contact', messageRoutes); // Alias for convenience

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Chief Milan Kumar Modak Portfolio API is operational.',
    endpoints: {
      health: 'GET /api/health',
      submitMessage: 'POST /api/messages',
      viewMessages: 'GET /api/messages',
    },
  });
});

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found on this fortress server.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});
