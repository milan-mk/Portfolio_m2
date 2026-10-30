import dotenv from 'dotenv';
dotenv.config();

import { app } from './src/app.js';
import { connectDB } from './src/config/db.js';

const PORT = process.env.PORT || 5000;

// Start Server immediately and initiate DB connection
const server = app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(` Citadel Fortress Backend Server Running`);
  console.log(` Port: ${PORT}`);
  console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Health URL: http://localhost:${PORT}/api/health`);
  console.log(` Message Endpoint: http://localhost:${PORT}/api/messages`);
  console.log(`=================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[Port Error] Port ${PORT} is already in use by another process.`);
    console.error(`You can change PORT in Backend/.env (e.g. PORT=5001) or terminate the process using port ${PORT}.\n`);
  } else {
    console.error(`[Server Error] ${err.message}`);
  }
});

// Connect to MongoDB
connectDB();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection] ${err.message}`);
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('\n[Citadel Backend] Shutting down gracefully...');
  server.close(() => {
    console.log('[Citadel Backend] Process terminated.');
    process.exit(0);
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
