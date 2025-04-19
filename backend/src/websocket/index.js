const WebSocket = require('ws');
const { getContainers } = require('../controllers/containers');

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });
  const clients = new Set();

  // Broadcast container updates to all connected clients
  const broadcastContainers = async (docker) => {
    try {
      const containers = await getContainers(docker);
      const message = JSON.stringify({
        type: 'containers',
        data: containers
      });

      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    } catch (error) {
      console.error('Error broadcasting containers:', error);
    }
  };

  wss.on('connection', (ws) => {
    clients.add(ws);

    ws.on('close', () => {
      clients.delete(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });

  // Set up periodic container updates
  let updateInterval;
  const startUpdates = (docker) => {
    updateInterval = setInterval(() => {
      broadcastContainers(docker);
    }, 10000); // Update every 10 seconds
  };

  const stopUpdates = () => {
    if (updateInterval) {
      clearInterval(updateInterval);
    }
  };

  return {
    wss,
    startUpdates,
    stopUpdates
  };
};

module.exports = { setupWebSocket }; 