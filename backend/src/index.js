require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Docker = require('dockerode');
const winston = require('winston');
const { setupRoutes } = require('./routes');
const { initializeDatabase } = require('./database');
const { setupWebSocket } = require('./websocket');

// Initialize logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Initialize Docker
const docker = new Docker();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Initialize database
initializeDatabase();

// Setup routes
setupRoutes(app, docker, logger);

// Setup WebSocket server
const server = setupWebSocket(app);

// Start server
server.listen(port, () => {
  logger.info(`Server running on port ${port}`);
}); 