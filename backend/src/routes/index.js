const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { 
  getContainers,
  restartContainer,
  getContainerLogs,
  getSystemMetrics,
  getRestartLogs,
  testWebhook
} = require('../controllers');

const setupRoutes = (app, docker, logger) => {
  const router = express.Router();

  // Auth routes
  router.post('/auth/login', async (req, res) => {
    // TODO: Implement Pterodactyl authentication
    res.status(501).json({ message: 'Not implemented yet' });
  });

  // Protected routes
  router.use(authenticateToken);

  // Container routes
  router.get('/containers', async (req, res) => {
    try {
      const containers = await getContainers(docker);
      res.json(containers);
    } catch (error) {
      logger.error('Error fetching containers:', error);
      res.status(500).json({ error: 'Failed to fetch containers' });
    }
  });

  router.post('/containers/:id/restart', async (req, res) => {
    try {
      const result = await restartContainer(docker, req.params.id);
      res.json(result);
    } catch (error) {
      logger.error('Error restarting container:', error);
      res.status(500).json({ error: 'Failed to restart container' });
    }
  });

  router.get('/containers/:id/logs', async (req, res) => {
    try {
      const logs = await getContainerLogs(docker, req.params.id);
      res.json(logs);
    } catch (error) {
      logger.error('Error fetching container logs:', error);
      res.status(500).json({ error: 'Failed to fetch container logs' });
    }
  });

  // System metrics
  router.get('/system', async (req, res) => {
    try {
      const metrics = await getSystemMetrics();
      res.json(metrics);
    } catch (error) {
      logger.error('Error fetching system metrics:', error);
      res.status(500).json({ error: 'Failed to fetch system metrics' });
    }
  });

  // Restart logs
  router.get('/logs', async (req, res) => {
    try {
      const logs = await getRestartLogs();
      res.json(logs);
    } catch (error) {
      logger.error('Error fetching restart logs:', error);
      res.status(500).json({ error: 'Failed to fetch restart logs' });
    }
  });

  // Webhook test
  router.post('/webhook/test', async (req, res) => {
    try {
      await testWebhook();
      res.json({ message: 'Test webhook sent successfully' });
    } catch (error) {
      logger.error('Error sending test webhook:', error);
      res.status(500).json({ error: 'Failed to send test webhook' });
    }
  });

  app.use('/api', router);
};

module.exports = { setupRoutes }; 