const si = require('systeminformation');
const { sendDiscordWebhook } = require('../utils/webhook');
const { logRestart } = require('../database');

const getContainers = async (docker) => {
  const containers = await docker.listContainers({ all: true });
  const containerDetails = await Promise.all(
    containers.map(async (container) => {
      const containerInfo = await docker.getContainer(container.Id).inspect();
      const stats = await docker.getContainer(container.Id).stats({ stream: false });
      
      return {
        id: container.Id,
        name: container.Name.replace(/^\//, ''),
        state: containerInfo.State.Status,
        status: containerInfo.State.Status,
        uptime: containerInfo.State.Running ? 
          Math.floor((Date.now() - new Date(containerInfo.State.StartedAt).getTime()) / 1000) : 0,
        cpu: stats.cpu_stats.cpu_usage.total_usage,
        memory: {
          used: stats.memory_stats.usage,
          limit: stats.memory_stats.limit
        },
        created: containerInfo.Created,
        image: containerInfo.Config.Image
      };
    })
  );

  return containerDetails;
};

const restartContainer = async (docker, containerId) => {
  const container = docker.getContainer(containerId);
  const containerInfo = await container.inspect();
  
  try {
    await container.restart();
    const restartLog = {
      containerId,
      containerName: containerInfo.Name.replace(/^\//, ''),
      action: 'manual',
      timestamp: new Date().toISOString()
    };
    
    await logRestart(restartLog);
    await sendDiscordWebhook({
      content: `Container ${containerInfo.Name} was manually restarted`
    });
    
    return { success: true, message: 'Container restarted successfully' };
  } catch (error) {
    throw new Error(`Failed to restart container: ${error.message}`);
  }
};

const getContainerLogs = async (docker, containerId) => {
  const container = docker.getContainer(containerId);
  try {
    const logs = await container.logs({
      stdout: true,
      stderr: true,
      tail: 100
    });
    return logs.toString();
  } catch (error) {
    throw new Error(`Failed to get container logs: ${error.message}`);
  }
};

const getSystemMetrics = async () => {
  const [cpu, mem, disk] = await Promise.all([
    si.currentLoad(),
    si.mem(),
    si.fsSize()
  ]);

  return {
    cpu: {
      load: cpu.currentLoad,
      cores: cpu.cpus.length
    },
    memory: {
      total: mem.total,
      used: mem.used,
      free: mem.free
    },
    disk: {
      total: disk[0].size,
      used: disk[0].used,
      free: disk[0].available
    }
  };
};

module.exports = {
  getContainers,
  restartContainer,
  getContainerLogs,
  getSystemMetrics
}; 