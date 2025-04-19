import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_PTERODACTYL_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add the API key to all requests
api.interceptors.request.use((config) => {
  const apiKey = process.env.REACT_APP_PTERODACTYL_API_KEY;
  if (apiKey) {
    config.headers.Authorization = `Bearer ${apiKey}`;
  }
  return config;
});

export const pterodactylApi = {
  // Server/Container Management
  getServers: () => api.get('/api/application/servers'),
  getServerDetails: (serverId) => api.get(`/api/application/servers/${serverId}`),
  getServerResources: (serverId) => api.get(`/api/client/servers/${serverId}/resources`),
  
  // Server Power Management
  startServer: (serverId) => api.post(`/api/client/servers/${serverId}/power`, { signal: 'start' }),
  stopServer: (serverId) => api.post(`/api/client/servers/${serverId}/power`, { signal: 'stop' }),
  restartServer: (serverId) => api.post(`/api/client/servers/${serverId}/power`, { signal: 'restart' }),
  
  // Server Status
  getServerStatus: (serverId) => api.get(`/api/client/servers/${serverId}`),
  
  // Server Console
  getServerConsole: (serverId) => api.get(`/api/client/servers/${serverId}/websocket`),
  sendCommand: (serverId, command) => api.post(`/api/client/servers/${serverId}/command`, { command }),
  
  // Error Handler
  handleApiError: (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.data);
      throw new Error(error.response.data.message || 'An error occurred with the Pterodactyl API');
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Request Error:', error.request);
      throw new Error('No response received from Pterodactyl server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Setup Error:', error.message);
      throw new Error('Error setting up request to Pterodactyl server');
    }
  }
}; 